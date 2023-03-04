use std::sync::mpsc::channel;

use serde_json::Value;
use tauri::{App, Wry};

use crate::built_info;

pub fn cli(app: &mut App<Wry>) {
	if let Ok(matches) = app.get_cli_matches() {
		println!();
		let mut terminate_after_cli = true;
		
		println!("CLI args: {:?}", matches.args);
		println!("CLI sub: {:?}", matches.subcommand);
		
		for m in matches.args {
			match (m.0.as_ref(), m.1) {
				("update", d) => {
					if let Value::Bool(b) = d.value {
						if b {
							let (tx, rx) = channel();
							let handle = app.handle();
							tauri::async_runtime::spawn(async move {
								match handle.updater().check().await {
									Ok(update) => {
										if update.is_update_available() {
											log::info!("Update available: {}", update.latest_version());
											if let Err(e) = update.download_and_install().await {
												log::error!("Error downloading update: {}", e);
											} else {
												log::info!("Update successfully");
											}
										} else {
											log::error!("No update available");
										}
									}
									Err(e) => {
										log::error!("Error checking for update: {}", e);
									}
								}
								tx.send(()).expect("Error sending message (update)");
							});
							
							rx.recv().expect("Error receiving message (update)");
						}
					}
				}
				("help", d) => {
					println!("{}", d.value.as_str().expect("help value is not a string"));
				}
				("version", d) => {
//								if let Value::Bool(b) = d.value {
					// tauri filters all other args, and sets this to Null if -v is passed
					if let Value::Null = d.value {
//									if b {
						println!("{}: {}", built_info::PKG_NAME, built_info::PKG_VERSION);
//									}
					}
				}
				("config", d) => {
					if let Value::Bool(b) = d.value {
						if b {
							println!("{}", crate::dirs::create_conf_folder().expect("Error creating config folder").display());
						}
					}
				}
				("data", d) => {
					if let Value::Bool(b) = d.value {
						if b {
							println!("{}", crate::dirs::create_data_folder().expect("Error creating data folder").display());
						}
					}
				}
				("cache", d) => {
					if let Value::Bool(b) = d.value {
						if b {
							println!("{}", crate::dirs::create_cache_folder().expect("Error creating cache folder").display());
						}
					}
				}
				("run", d) => {
					if let Value::Bool(b) = d.value {
						if b {
							terminate_after_cli = false;
						}
					}
				}
				_ => {}
			};
		}
		
		if let Some(sub) = matches.subcommand {
			match (sub.name.as_ref(), sub.matches) {
				("migrations", m) => {
					for m in m.args {
						match (m.0.as_ref(), m.1) {
							("revert", d) => {
								if let Value::Bool(b) = d.value {
									if b {
										println!("Reverting migrations");
									}
								}
							}
							("list", d) => {
								if let Value::Bool(b) = d.value {
									if b {
										println!("Listing migrations");
									}
								}
							}
							("apply", d) => {
								if let Value::Bool(b) = d.value {
									if b {
										println!("Applying migrations");
									}
								}
							}
							_ => {}
						}
					}
				}
				("fef", m) => {}
				_ => {}
			}
		}
		
		if terminate_after_cli {
			let handle = app.handle();
			handle.exit(0)
		}
	}
}