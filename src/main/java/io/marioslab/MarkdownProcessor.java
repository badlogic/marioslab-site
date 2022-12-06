package io.marioslab;

import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

import io.marioslab.basis.site.SiteFile;
import io.marioslab.basis.site.SiteFileProcessor;
import kotlin.text.Charsets;

public class MarkdownProcessor implements SiteFileProcessor {
    static final String BEGIN_MARKER = "--markdown-begin";
    static final String END_MARKER = "--markdown-end";
    final Parser parser;
    final HtmlRenderer renderer;

    public MarkdownProcessor() {
        parser = Parser.builder().build();
        renderer = HtmlRenderer.builder().escapeHtml(false).build();
    }

    @Override
    public void process(SiteFile file) {
        if (!file.getInput().getName().endsWith(".md")) return;

        String input = new String(file.getContent(), Charsets.UTF_8);

        int cursor = 0;
        StringBuffer buffer = new StringBuffer();
        while(true) {
            int begin = input.indexOf(BEGIN_MARKER, cursor);
            if (begin == -1) break;
            buffer.append(input.substring(cursor, begin));
            cursor = begin + BEGIN_MARKER.length();
            int end = input.indexOf(END_MARKER, begin);
            if (end == -1) break;
            cursor = end + END_MARKER.length();

            String markdown = input.substring(begin + BEGIN_MARKER.length(), end);
            Node node = parser.parse(markdown);
            String html = renderer.render(node);
            buffer.append(html);
        }
        if (cursor < input.length()) buffer.append(input.substring(cursor, input.length()));
        file.setContent(buffer.toString().getBytes(Charsets.UTF_8));
    }

    @Override
    public String processOutputFileName(String fileName) {
        return fileName.replace(".md", ".html");
    }

}
