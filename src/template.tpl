@font-face {
  font-style: normal;
  font-weight: normal;
  font-family: '<%= fontName %>';
  src: url('<%= fontPath %><%= fontName %>.eot?<%= cacheBuster %>');
  src: url('<%= fontPath %><%= fontName %>.eot?<%= cacheBuster %>#iefix') format('embedded-opentype'),
       url('<%= fontPath %><%= fontName %>.woff2<%= cacheBusterQueryString %>') format('woff2'),
       url('<%= fontPath %><%= fontName %>.woff<%= cacheBusterQueryString %>') format('woff'),
       url('<%= fontPath %><%= fontName %>.ttf<%= cacheBusterQueryString %>') format('truetype'),
       url('<%= fontPath %><%= fontName %>.svg<%= cacheBusterQueryString %>#<%= fontName %>') format('svg');
}

[class^="<%= cssClass %>-"], [class*=" <%= cssClass %>-"]{
  font-family: "<%= fontName %>" !important;
  font-style: normal;
  font-weight: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

<% _.each(glyphs, function(glyph) { %>
.icon-aut-<%= glyph.fileName %>:before {
  content: "\<%= glyph.codePoint %>";
}
<% }); %>
