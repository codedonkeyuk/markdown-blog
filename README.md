# markdown-blog

This project is a static markdown/SVG blog, posts are written in markdown everything else is static HTML.

I built this because I don't wnat the security overhead of running a next.js serverside application. I want to focus on writing code, static sites are very secure.

I hate CMSs because of the security risks they pose, and their performance issues. There are good static generators out there, but I wanted complete creative control, I don't want to to configure other folks plugins every few weeks. I also wanted to stream line the delivery of posts, so that is does not impact on my spare time.

Selfishly I like drawing SVG's, I not only find it easy but also very satisfying. You also get better performance from SVG's, and look better on different sized devices. You can enbed other image formats within the blog content `content.md`, but thumbnail and post images are strictly SVG.

## Prerequisites

This has been designed to work with inkscape. If you can't design with SVG's then this blog is not for you.

This site also converts SVGs into PNGs using the inkscape app, so it will break without inkscape installed.

I also wrote this on MAC, support is offered for windows but I never tested it directly.

## How to build

### Develop stright away

So stright out of the box; you can run the dev version of the site and modify html, css and JS stright away. Those files can be found in [./src/site](./src/site/)

```bash
  npm run serveDev
```

This site uses comment tags to inject variables into production code. So don't delete any comments `<!--INJECT-*-START-->` or `<!--INJECT-*-END-->`. Any code withion those tags will be completely replaced, so don't edit anything in there.

### Create a blog entry

You call the following script to create a blog entry. It will request a blog name. All blogs are prefixed with a timestamp, so multiple posts can have the same name.

```bash
npm run createPost
```

Your new post can be found in [./src/blog-content](./src/blog-content).

You can then tailer your blog entry however you like. Here is abreakdow nof the files and what the do

### Create the site

Once you are happy simple call

```bash
npm run build
```

The generated site can be found in [./dist](./dist).

To test it our run

```bash
npm run serveProd
```

You can review your changes at [http://localhost:8080](http://localhost:8080). The site injects a service worker. So you may need ot do a hard reload if you changes do not appear.

| blog file         | Description                                                                                                                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/content.md`     | THis is markdownfile where you post content lives. WImply edit using a markdown editor. Not all markdown is support, paragraphs, headings, and lists are, and code samples. Tables are not for usability reasons |
| `/post-image.svg` | The main image for the blog post, will be seen in the post its self.                                                                                                                                             |
| `/post-info.json` | All the information outside the post contnet. Creation date time, author, text used in social shares, image descriptions for accessibility                                                                       |
| `/thumbnail.svg`  | Used by social share links (LinkedIn, Twitter, instagram, etc). Used by post index page in dessktop mode, in mobile it is replaced by `/post-image.svg` as it looks better                                       |

It is expected that you will have to updated the images and the content in post-info.json. If you push ut owu it wont make any sence.

## Project Layout

This project is very big and convoluted. I suspect ill break the templating logic into a separate project in the future. Run it like babel, or web pack. For now there is a we bit of a learning curve, sorry!

| Path.                       | Description                                                                                                                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/dist`                     | Directory into which the static site is generated. You can also test this locally via `npm run serveProd`                                                                                           |
| `/src`                      | All the source code is found here, it serves multiple purposes though. Next few lines will explain                                                                                                  |
| `/src/app-config.ts`        | Contains configuration used by the application. Like site name etc                                                                                                                                  |
| `/src/blog-content`         | This is where the blog contentlives. Each subdirectory is a new blog entry. After you run create post you edidt the various files in here                                                           |
| `/src/code`                 | All the code used by the project                                                                                                                                                                    |
| `/src/code/blog-generation` | The code used to generate the site and blog. It supports minification as well.                                                                                                                      |
| `/src/code/create-post`     | Code to generate a post in `/src/blog-content`                                                                                                                                                      |
| `/src/code/deploy-site`     | sftp script which deploys the site to the live server                                                                                                                                               |
| `/src/code/html-validate`   | Code used to validate the html in both production and dev. Uses the HTML-validate package                                                                                                           |
| `/src/code/serve-dev`       | App used by `npm run serveDev` serves dev site for live editing.                                                                                                                                    |
| `/src/site`                 | This is the static site that the blog is built from. When you run `npm run serveDev` you are serving this directory. Blog content can only be seen in `dist` and is served from `npm run serveProd` |

## Commands

| Command              | Description                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `npm run validate`   | Uses prettier to validate project                                                                                   |
| `npm run clean`      | Applies prettier to project (can't build project unless cleaned)                                                    |
| `npm run deleteDist` | Deletes the dist directory                                                                                          |
| `npm run test`       | Runs the tests found in the src/code                                                                                |
| `npm run createPost` | Creates a post in src/blog-content. You can then edit its contents how you like, which will be rendered by the site |
| `npm run serveDev`   | serves dev site (no posts) with livereload. Available [http://localhost:3001](http://localhost:3001)                |
| `npm run serveProd`  | serves prod site (with posts) with livereload. Available [http://localhost:3001](http://localhost:3001)             |
| `npm run build`      | builds the project in dist directory. Combines site and blog into a static site ready for deployment                |

### Git Submodule

If you accidently delete the dist folder, then run the following comand in the root of the project to revive if.

```
git submodule update --init --recursive
```
