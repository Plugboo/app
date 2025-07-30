pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        //        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
