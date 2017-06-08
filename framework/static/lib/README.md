Adjustments made to certain libraries:

## Fancybox

Changed call of "text()" to "html()" in line 265 of jquery.fancybox.js to allow
for HTML to be used again in image titles. This change has been made in the minified
file, too. All the other files fancybox needs can be used from node_modules/fancybox.
