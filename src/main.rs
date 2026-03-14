use std::fs::{self, File};

use actix_files::NamedFile;
use actix_web::{App, HttpRequest, HttpResponse, HttpServer, guard, http::Error, web::route};
use chrono::Utc;
use log::LevelFilter;
use simplelog::{ColorChoice, CombinedLogger, TermLogger, TerminalMode, WriteLogger};
use yew::{ServerRenderer, prelude::*};

#[component]
fn AppContainer() -> Html {
    html! {
        <div>
            {"Test"}
        </div>
    }
}

async fn index() -> Result<HttpResponse, Error> {
    let renderer = ServerRenderer::<AppContainer>::new();
    let res = renderer.render().await;

    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(format!(
            r#"<!DOCTYPE html>
            <html>
                <head>
                    <link rel="icon" type="image/png" href="favicon.png">
                </head>
                <body>
                    {}
                </body>
            </html>
            "#,
            res
        ))
    )
}

async fn static_file(req: HttpRequest) -> actix_web::Result<NamedFile> {
    let file_name: String = req.match_info().query("file").parse().unwrap();
    let path = "./public/".to_owned() + &file_name;
    Ok(NamedFile::open(path)?)
}

#[actix_web::main]
async fn main() -> Result<(), std::io::Error> {
    println!("Setting up logging");
    fs::create_dir_all("logs").unwrap();
    CombinedLogger::init(
        vec![
            TermLogger::new(LevelFilter::Info, simplelog::Config::default(), TerminalMode::Mixed, ColorChoice::Auto),
            WriteLogger::new(LevelFilter::Debug, simplelog::Config::default(), File::create(format!("logs/{}.log", Utc::now().format("%Y-%m-%d"))).unwrap()),
        ]
    ).unwrap();

    log::info!("frizim-web v{}", env!("CARGO_PKG_VERSION"));
    log::info!("Initializing web server");
    HttpServer::new(move || {
        App::new()
            .route("/{file:[a-zA-Z0-9]+(\\.[a-zA-Z]+)?}", route()
                .guard(guard::Get())
                .to(static_file)
            )
            .route("/", route()
                .guard(guard::Get())
                .to(index)
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
