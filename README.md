# markdown-blog

This is a static CMS project. This library has been designed to generate a blog from mardown files. When imported into another project, that project can use commands to add a post, generate the site, server the site etc.

# Project instructions (for developers)

## Project Layout

| Path.               | Description                                                                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/assets/site`      | This is the static site that the blog is built from. When you run `serve-dev` you are serving this directory. Blog content can only be seen in `dist` and is served from `serve-prod` |
| `/tmp/blog-content` | This is where the blog contentlives. Each subdirectory is a new blog entry. After you run create post you edit the various files in here                                              |
| `/tmp/site`         | Directory into which the static site is generated. You can also test this locally via `npm run serveProd`                                                                             |
| `/src`              | Source code of the project written in typescript                                                                                                                                      |
| `/dist`             | Javascript used in module generated from src                                                                                                                                          |

## Commands

This is quite a convoluted project, so i have split the commands into two distinked sctions.

The core commands are for the project generation.

Live test commands are the commands that are exported by the porject for website creation. This is used locally for testing.

### Core Commands for Building Libray

| Command            | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `npm run validate` | Uses prettier to validate project                                |
| `npm run clean`    | Applies prettier to project (can't build project unless cleaned) |
| `npm run build`    | builds the project in dist directory.                            |
| `npm run test`     | Runs the tests found in the src/code                             |
| `npm run coverage` | Runs coverage report                                             |

### Live Test Commands

| Command                | Description                                                      |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run buildBlog`    | Builds the blog from the static assets found in blog-config.json |
| `npm run createPost`   | Createa a new markdown post to generate post pages from          |
| `npm run validateDev`  | Validates the dev assets (before site build)                     |
| `npm run validateProd` | Validates the prod assets (after site build)                     |
| `npm run serveDev`     | Serves the template unmodified                                   |
| `npm run serveProd`    | Serves the generated website (ppost buildBlog)                   |

# Tool instructions (For website creators)

## Prerequisites

### Add Config file to you project

You need to create a `blog-config.json` file in the root of your project.

```json
{
  "siteSourcePath": "./src/site",   # your html files live here
  "postSourcePath": "./src/blog-content", # your blog posts will be generate here
  "productionPath": "./dist" # your production site will be produced here
}
```

### Copy HTML

To get started quickly on a fresh project, copy the template [./assets/site](./assets/site) into you project.

If you have an existing project, copy tags found in [./assets/site/blog/page1.html](./assets/site/blog/page1.html) & [assets/site/blog/post/post.html](assets/site/blog/post/post.html) into your project. The tags look like the following, each has a opening and close tag.

```html
<!--INJECT-META-OG-URL-START--><!--INJECT-META-OG-URL-END-->
```

### Setup

```bash
npm install   #install dependencies
npm run build #build the project
npm link      # create global link, project commands are now available everywhere.

npm link PROJECT-NAME # Link to a single project

create-post # create a post entry
build-blog # build the blog
```

### Commands available for site development

| Command              | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| `build-blog`         | builds the blog from bog enteries                                   |
| `create-post`        | creates a blog post                                                 |
| `serve-dev`          | serves the static site without posts, which has live reload enabled |
| `serve-prod`         | serves the production site with posts                               |
| `html-validate-dev`  | validate dev site html                                              |
| `html-validate-prod` | validate production site html                                       |

### Serve Site

So stright out of the box; you can run the dev version of the site and modify html, css and JS stright away. Those files can be found in [./src/site](./src/site/)

```bash
  serve-dev  # serve html template live, with no posts and livereload
  serve-prod # serve html gnerate site, with posts and no livereload
```

### Create a blog entry

You call the following script to create a blog entry. It will request a blog name. All blogs are prefixed with a timestamp, so multiple posts can have the same name.

```bash
create-post
```

Your new post can be found in [./src/blog-content](./src/blog-content).

You can then tailer your blog entry however you like. Here is a breakdown of files generated in a blog entry.

It is expected that you will have to update the images and the content in post-info.json and content.md. Here is a breakdown of these files.

| blog file         | Description                                                                                                                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/content.md`     | THis is markdownfile where you post content lives. WImply edit using a markdown editor. Not all markdown is support, paragraphs, headings, and lists are, and code samples. Tables are not for usability reasons |
| `/post-image.svg` | The main image for the blog post, will be seen in the post and social media shares.                                                                                                                              |
| `/post-info.json` | All the information outside the post contnet. Creation date time, author, text used in social shares, image descriptions for accessibility                                                                       |

### Prevent publication of the post

Within your new post directory you will find a file labeld `postinfo.json`. Set it to false

```json
{
  ...
  "publish" : false,
}
```

When publish is false its ignored by the site generator.
Then when you are ready to publish change set it to `true`.

This is handy when you need time to write the blog, and create the custom images.

### Create the site

Once you are happy simply call

```bash
build-blog  # builds the blog
serve-prod  # serves blog for review
```

You can review your changes at [http://localhost:8080](http://localhost:8080). The site injects a service worker. So you may need ot do a hard reload if you changes do not appear.
