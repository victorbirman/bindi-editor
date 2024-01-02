document.addEventListener("DOMContentLoaded", function () {
  // Get references to the input elements, editor, and preview
  const titleInput = document.getElementById("title");
  const subtitleInput = document.getElementById("subtitle");
  const editor = document.getElementById("editor");
  const preview = document.getElementById("preview");
  const categoryInput = document.getElementById("category");
  // Function to convert Markdown to HTML
  function convertMarkdownToHtml() {
    const title = titleInput.value;
    const subtitle = subtitleInput.value;
    let markdownText = editor.value;

    // Display the title and subtitle above the editor
    let titleHtml = "";
    if (title) {
      titleHtml = "<h1>" + title + "</h1>";
    }

    let subtitleHtml = "";
    if (subtitle) {
      subtitleHtml = "<h2>" + subtitle + "</h2>";
    }

    const fullMarkdown = titleHtml + subtitleHtml + marked.parse(markdownText);
    preview.innerHTML = fullMarkdown;
    return fullMarkdown;
  }

  // Convert Markdown to HTML when the editor content changes
  editor.addEventListener("input", convertMarkdownToHtml);
  titleInput.addEventListener("input", convertMarkdownToHtml);
  subtitleInput.addEventListener("input", convertMarkdownToHtml);

  // Initialize the preview with the initial content
  convertMarkdownToHtml();

  // Download button click event handler
  const downloadButton = document.getElementById("downloadButton");

  downloadButton.addEventListener("click", function () {
    const accentMap = {
      á: "a",
      é: "e",
      í: "i",
      ó: "o",
      ú: "u",
      ñ: "n",
    };

    let sanitizedTitle = titleInput.value.trim();
    const category = categoryInput.value;

    // Replace accented vowels in the title
    for (const [accentedVowel, unaccentedVowel] of Object.entries(accentMap)) {
      const regex = new RegExp(accentedVowel, "gi");
      sanitizedTitle = sanitizedTitle.replace(regex, unaccentedVowel);
    }

    const dashedTitle = sanitizedTitle
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    const htmlHeader = `
    <!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href="https://bindi.world/contenido/${dashedTitle}.html" />
    <link rel="icon" type="image/x-icon" href="favicon.png" />
    <title>${titleInput.value}</title>

    <link rel="stylesheet" href="style-articles.css" />
    <link rel="stylesheet" href="../style-hamburger.css" />

    <script src="../hamburgerMenu.js" defer></script>
    <script src="scriptArticles.js" defer></script>
  </head>
  <body>
    <nav>
      <a href="../index.html"
        ><img class="logo" src="../icons/bindi_logo.png" alt="Bindi"
      /></a>
      <ul class="top-menu">
        <li>
          <a href="../contenido/quienes-somos.html">Qui&eacute;nes somos</a>
        </li>
        <li>
          <a href="../noticias.html">Noticias</a>
        </li>
        <li>
          <a href="../videos.html">Videos</a>
        </li>
        <li><a href="mailto:world.bindi@gmail.com">Contacto</a></li>
      </ul>
      <button class="radio">&#9654; EN VIVO</button>
      <div class="hamburger" onclick="toggleHamburgerMenu()">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="hamburger-menu">
          <ul>
            <li>
              <a href="../contenido/quienes-somos.html">Qui&eacute;nes somos</a>
            </li>
            <li>
              <a href="../noticias.html">Noticias</a>
            </li>
            <li>
              <a href="../videos.html">Videos</a>
            </li>
            <li><a href="mailto:world.bindi@gmail.com">Contacto</a></li>
          </ul>
        </div>
      </div>
    </nav>
      <img src="${dashedTitle}_banner.jpg" class="banner" />`;
    const htmlFooter = `</body></html>`;
    const fullMarkdown = convertMarkdownToHtml();

    // Replace <imagen> with <img> with class "ilustracion" and src attribute based on the title input
    const processedMarkdown =
      htmlHeader +
      fullMarkdown.replace(
        /<imagen([^>]*)>/g,
        `<img class="ilustracion" src="${dashedTitle}_ilustracion.jpg" $1>`
      ) +
      htmlFooter;

    const blob = new Blob([processedMarkdown], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dashedTitle}.html`;
    a.click();

    // Create the JSON file content
    const jsonData = {
      title: titleInput.value,
      subtitle: subtitleInput.value,
      cover: `${dashedTitle}.jpg`,
      href: `${dashedTitle}.html`,
      category: category, // Include the Markdown content in the JSON file
    };

    const blobJson = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const urlJson = URL.createObjectURL(blobJson);
    const aJson = document.createElement("a");
    aJson.href = urlJson;
    aJson.download = `${dashedTitle}.json`;
    aJson.click();
  });
});
