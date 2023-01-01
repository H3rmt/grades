use std::fmt;

use error_stack::{IntoReport, Result, ResultExt};
use flexi_logger::{DeferredNow, Duplicate, FileSpec, Logger, style, TS_DASHES_BLANK_COLONS_DOT_BLANK, WriteMode};
use log::Record;

use crate::dirs;

fn format(
	w: &mut dyn std::io::Write,
	now: &mut DeferredNow,
	record: &Record,
) -> std::io::Result<()> {
	let level = record.level();
	write!(
		w,
		"[{}] {} ({}:{}) {}",
		style(level).paint(now.format(TS_DASHES_BLANK_COLONS_DOT_BLANK).to_string()),
		style(level).paint(record.level().to_string()),
		record.file().unwrap_or("<unnamed>"),
		record.line().unwrap_or(0),
		style(level).paint(&record.args().to_string())
	)
}

pub fn logger() -> Result<(), LoggerInitError> {
	let logger = Logger::try_with_env_or_str("RUST_LOG=grades=info,migrations=info")
			.into_report()
			.attach_printable("Error initializing logger")
			.change_context_lazy(|| LoggerInitError)?;
	
	#[cfg(not(debug_assertions))] let logger = {
		logger.duplicate_to_stderr(Duplicate::Warn)
				.format_for_stdout(format)
				.format_for_stderr(flexi_logger::colored_detailed_format)
	};
	
	#[cfg(debug_assertions)] let logger = {
		logger.duplicate_to_stdout(Duplicate::All)
				.format_for_stdout(format)
	};
	
	let spec = FileSpec::try_from(dirs::create_cache_log()
			.attach_printable("Error creating cache log")
			.change_context_lazy(|| LoggerInitError)?
	).into_report()
	 .attach_printable("Error creating FileSpec")
	 .change_context_lazy(|| LoggerInitError)?;
	
	let logger = logger.log_to_file(spec)
							 .write_mode(WriteMode::BufferAndFlush)
							 .format_for_files(flexi_logger::with_thread);
	
	logger.start()
			.into_report()
			.attach_printable("Error starting logger")
			.change_context_lazy(|| LoggerInitError)?;
	
	Ok(())
}

#[derive(Debug)]
pub struct LoggerInitError;

impl fmt::Display for LoggerInitError {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "Error initialising Logger")
	}
}

impl std::error::Error for LoggerInitError {}
