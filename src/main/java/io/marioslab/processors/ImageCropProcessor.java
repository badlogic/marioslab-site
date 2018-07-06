
package io.marioslab.processors;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.plugins.jpeg.JPEGImageWriteParam;
import javax.imageio.stream.MemoryCacheImageOutputStream;

import io.marioslab.basis.site.SiteFile;
import io.marioslab.basis.site.SiteFileProcessor;
import io.marioslab.basis.site.SiteGenerator.SiteGeneratorException;

public class ImageCropProcessor implements SiteFileProcessor {
	static final int WIDTH = 680;
	static final int HEIGHT = 330;

	@Override
	public void process (SiteFile file) {
		if (!file.getInput().getName().contains(".crop.")) return;

		try {
			BufferedImage image = ImageIO.read(new ByteArrayInputStream(file.getContent()));
			BufferedImage output = new BufferedImage(WIDTH, HEIGHT, image.getType());

			Graphics2D g = output.createGraphics();
			g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
			int srcHeight = (int)(image.getWidth() * ((float)HEIGHT / WIDTH));
			g.drawImage(image, 0, 0, WIDTH, HEIGHT, 0, image.getHeight() / 2 - srcHeight / 2, image.getWidth(),
				image.getHeight() / 2 + srcHeight / 2, null);
			g.dispose();

			ImageWriter writer = ImageIO.getImageWritersByFormatName("jpg").next();
			JPEGImageWriteParam jpegParams = new JPEGImageWriteParam(null);
			jpegParams.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
			jpegParams.setCompressionQuality(1f);
			ByteArrayOutputStream bytes = new ByteArrayOutputStream();
			writer.setOutput(new MemoryCacheImageOutputStream(bytes));
			writer.write(null, new IIOImage(output, null, null), jpegParams);
			file.setContent(bytes.toByteArray());
		} catch (IOException e) {
			throw new SiteGeneratorException("Couldn't crop image " + file.getInput().getPath(), e);
		}
	}

	@Override
	public String processOutputFileName (String fileName) {
		return fileName.replace(".crop.", ".");
	}

}
