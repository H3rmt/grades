use std::fmt;

use error_stack::{IntoReport, Report, Result, ResultExt};
use error_stack::fmt::ColorMode;
use flexi_logger::{DeferredNow, Duplicate, FileSpec, Logger, style, WriteMode};
use log::Record;

use crate::dirs;

pub fn file_format(
	w: &mut dyn std::io::Write,
	now: &mut DeferredNow,
	record: &Record,
) -> std::io::Result<()> {
	write!(
		w,
		"[{}] {:<5} ({}:{}) {}",
		now.format("%Y-%m-%d %H:%M:%S%.3f"),
		record.level(),
//		record.module_path().unwrap_or("<unnamed>"),
		record.file().unwrap_or("<unnamed>"),
		record.line().unwrap_or(0),
		&record.args()
	)
}

pub fn console_format(
	w: &mut dyn std::io::Write,
	now: &mut DeferredNow,
	record: &Record,
) -> std::io::Result<()> {
	let level = record.level();
	write!(
		w,
		"[{}] {:0<8} /{}:{} {}",
		style(level).paint(now.format("%Y-%m-%d %H:%M:%S").to_string()),
		style(level).paint(record.level().to_string()),
		record.file().unwrap_or("<unnamed>"),
		record.line().unwrap_or(0),
		style(level).paint(&record.args().to_string())
	)
}

pub fn logger() -> Result<(), LoggerInitError> {
	let logger = Logger::try_with_env_or_str("grades=info,migrations=info")
			.into_report()
			.attach_printable("Error initializing logger")
			.change_context_lazy(|| LoggerInitError)?;
	
	#[cfg(not(debug_assertions))] let logger = {
		logger.duplicate_to_stderr(Duplicate::Warn)
	};
	
	#[cfg(debug_assertions)] let logger = {
		logger.duplicate_to_stdout(Duplicate::All)
	};
	
	let spec = FileSpec::try_from(dirs::create_cache_log()
			.attach_printable("Error creating cache log")
			.change_context_lazy(|| LoggerInitError)?
	).into_report()
	 .attach_printable("Error creating FileSpec")
	 .change_context_lazy(|| LoggerInitError)?;
	
	let logger = logger.log_to_file(spec)
							 .write_mode(WriteMode::BufferAndFlush)
							 .format_for_files(file_format)
							 .format_for_stdout(console_format)
							 .format_for_stderr(console_format);
	
	logger.start()
			.into_report()
			.attach_printable("Error starting logger")
			.change_context_lazy(|| LoggerInitError)?;
	
	Report::set_color_mode(ColorMode::None);
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
