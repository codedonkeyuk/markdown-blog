# @markdown-blog/template

This is a simple HTML template that uses the @markdown-blog/lib to generate a html site. It shows how the library can be used in production. Feel free to copy and use it as a starting point.

## Commands

These script commands have been simplified to let the template behave more like a node project. For example validate wraps both the dev and prod commands.

_If you look at the scripts sections you will see all the library commands look like this `"node ../lib/dist/cli.js build",`. This is a workaround for node workspaces, does see the library as an executable. If you are installing this as an external dependency you can change that to `"markdown-blog build",` because npm will see it as an executable._

| Command                       | Description                                                      |
| ----------------------------- | ---------------------------------------------------------------- |
| `npm run build`               | Builds the blog from the static assets found in blog-config.json |
| `npm run createPost -- TITLE` | Create a new markdown post inject the title to create it         |
| `npm run validate`            | Runs both validate commands both prod and dev                    |
| `npm run serveDev`            | Serves the template unmodified                                   |
| `npm run serveProd`           | Serves the generated website (post buildBlog)                    |

## Instructions

The src folder contains a `site` and `blog-content` subdirectory. Site is the static template used for generating the site. Blog-content is the where the blog posts live.

To generate a new blog post simple call `npm run createPost -- NEW-POST-TITLE` (replace NEW-POST-TITLE with one of your choosing). You can then edit the image and content how ever you like.

You can test the template straight away with `npm run serveDev`. You can live edit the content and see it change live in the browser.

You can test the generated site by calling `npm run serveProd`. THis does not allow live edits as its showing the live generated site. You need to call `npm run build` to see the latest changes.
