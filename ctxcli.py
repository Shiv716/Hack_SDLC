import typer
import subprocess
import webbrowser

app = typer.Typer()


@app.command()
def validate():
    typer.echo("✅ Validating requirements...")
    # Example: Check if requirements.txt exists
    subprocess.run(["ls", "requirements.txt"])


@app.command()
def compliance():
    typer.echo("🔍 Running compliance scan...")
    # Example: Simulate running a security scanner
    subprocess.run(["echo", "Running Snyk..."])


@app.command()
def ci(trigger: bool = typer.Option(False, help="Trigger a CI job")):
    if trigger:
        typer.echo("🚀 Triggering CI pipeline...")
    else:
        typer.echo("📊 Checking CI status...")


@app.command()
def openweb(url: str = typer.Argument(..., help="The URL to open")):
    """Open a webpage in the default browser."""
    typer.echo(f"🌐 Opening: {url}")
    webbrowser.open(url)


if __name__ == "__main__":
    app()