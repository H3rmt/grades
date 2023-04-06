use std::sync::mpsc::channel;

use error_stack::{IntoReport, ResultExt};
use sea_orm::DatabaseConnection;
use serde_json::Value;
use tauri::{App, Wry};

use migrations::{Migrator, MigratorTrait};

use crate::built_info;

pub fn cli(app: &mut App<Wry>, connection: DatabaseConnection) {
	if let Ok(matches) = app.get_cli_matches() {
		log::debug!("");
		
		let mut terminate_after_cli = matches.subcommand.is_some() || matches.args.contains_key("help") || matches.args.contains_key("version") || matches.args.iter().any(|m| m.1.occurrences > 0);
		
		log::debug!("terminate_after_cli: {:?}", terminate_after_cli);
		log::debug!("CLI args: {:?}", matches.args);
		log::debug!("CLI sub: {:?}", matches.subcommand);
		
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
											println!("Update available: {}", update.latest_version());
											if let Err(e) = update.download_and_install().await {
												println!("Error downloading update: {}", e);
											} else {
												println!("Update successfully");
											}
										} else {
											println!("No update available");
										}
									}
									Err(e) => {
										println!("Error checking for update: {}", e);
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
					// tauri/clap filters all other args, and sets this to Null if -v is passed
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
							("list", d) => {
								if let Value::Bool(b) = d.value {
									if b {
										let (tx, rx) = channel();
										
										let conn = connection.clone();
										tauri::async_runtime::spawn(async move {
											let vec = Migrator::get_migration_models(&conn)
													.await
													.into_report()
													.attach_printable("Error loading migrations")
													.map_err(|e| {
														log::error!("{:?}", e);
													}).expect("Error loading migrations");
											
											tx.send(vec).expect("Error sending message (update)");
										});
										
										let vec = rx.recv().expect("Error receiving message (update)");
										println!("{:#?}", vec);
									}
								}
							}
							("revert", d) => {
								if let Value::Bool(b) = d.value {
									if b {
										let (tx, rx) = channel();
										
										let conn = connection.clone();
										tauri::async_runtime::spawn(async move {
											Migrator::down(&conn, Some(1))
													.await
													.into_report()
													.attach_printable("Error running migrations")
													.map_err(|e| {
														log::error!("{:?}", e);
													}).expect("Error running migrations");
											tx.send(()).expect("Error sending message (revert)");
										});
										
										rx.recv().expect("Error receiving message (revert)");
										println!("Reverted migration");
									}
								}
							}
							("apply", d) => {
								if let Value::Bool(b) = d.value {
									if b {
										let (tx, rx) = channel();
										
										let conn = connection.clone();
										tauri::async_runtime::spawn(async move {
											Migrator::up(&conn, Some(1))
													.await
													.into_report()
													.attach_printable("Error running migrations")
													.map_err(|e| {
														log::error!("{:?}", e);
													}).expect("Error running migrations");
											tx.send(()).expect("Error sending message (apply)");
										});
										
										rx.recv().expect("Error receiving message (apply)");
										println!("Applied migration");
									}
								}
							}
							_ => {}
						}
					}
				}
				("fef", _m) => {}
				_ => {}
			}
		}
		
		if terminate_after_cli {
			let handle = app.handle();
			handle.exit(0)
		}
	}
}