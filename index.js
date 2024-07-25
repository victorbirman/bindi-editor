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
    <link rel="icon" type="image/x-icon" href="favicon.png" />
    <title>${titleInput.value}</title>
    <meta name="description" content="${subtitleInput.value}">
    <link rel="canonical" href="https://bindi.world/contenido/${dashedTitle}.html">
    <!-- Meta tags for social media sharing -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${titleInput.value}">
    <meta property="og:description" content="${subtitleInput.value}">
    <meta property="og:image" content="https://bindi.world/contenido/${dashedTitle}.jpg">
    <meta property="og:url" content="https://bindi.world/contenido/${dashedTitle}.html">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${titleInput.value}">
    <meta name="twitter:description" content="${subtitleInput.value}">
    <meta name="twitter:image" content="https://bindi.world/contenido/${dashedTitle}.jpg">
    <!-- End of meta tags for social media sharing -->
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
      <input type="text" class="search-input hidden" placeholder="Búsqueda" name="search">
      <div class="search-results hidden"></div>
      <li class="hideable"><a href="../contenido/quienes-somos.html">Qui&eacute;nes somos</a></li>

      
      <li class="hideable"><a href="../noticias.html">Noticias</a></li>

      <li class="hideable"><a href="../videos.html">Videos</a></li >

      <li class="hideable"><a href="mailto:world.bindi@gmail.com">Contacto</a></li>



        <div class="magnifier"> <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10 5C7.23858 5 5 7.23858 5 10C5 12.7614 7.23858 15 10 15C11.381 15 12.6296 14.4415 13.5355 13.5355C14.4415 12.6296 15 11.381 15 10C15 7.23858 12.7614 5 10 5ZM3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 11.5719 16.481 13.0239 15.6063 14.1921L20.7071 19.2929C21.0976 19.6834 21.0976 20.3166 20.7071 20.7071C20.3166 21.0976 19.6834 21.0976 19.2929 20.7071L14.1921 15.6063C13.0239 16.481 11.5719 17 10 17C6.13401 17 3 13.866 3 10Z" fill="#000000"/>
          </svg></div>
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
      <img src="${dashedTitle}_banner.jpg" class="banner" alt="${titleInput.value}"/>`;
    const recomendados = `<div class="recomendados"></div>`;
    const htmlFooter = `</body></html>`;
    const fullMarkdown = convertMarkdownToHtml();

    // Replace <imagen> with <img> with class "ilustracion" and src attribute based on the title input
    const processedMarkdown =
      htmlHeader +
      fullMarkdown.replace(
        /<imagen([^>]*)>/g,
        `<img class="ilustracion" src="${dashedTitle}_ilustracion.jpg" alt="${titleInput.value}" $1>`
      ) +
      recomendados +
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

/* <body>
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
  </ul> */
