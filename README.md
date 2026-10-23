## Markdown blog

This project takes a static HTML template and injects a HTML blog generated from markdown files. The library generates the blog markdown files, which it then converts into HTML site. This library also validates HTML, CSS and JS. Allows the user to demo the site locally.

I built this because I don't like server side driven CMS's. As a web developer I have been forced to build sites that have taken 3 times as long because of the complexity of CMSs. Also I want an excuse to work with raw, html css and js. I build a lot of SPAs, its surprising how much of the underlining logic is shielded from you.

## Project Structure

- [@markdown-blog/lib](./workspace/lib/README.md) - This is the core project which can be installed in any site and generate minify that site for production
- [@markdown-blog/template](./workspace/template/README.md) - THis is an example template that uses the lib file to generate a basic website.
