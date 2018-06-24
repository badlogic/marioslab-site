
package io.marioslab.site;

import io.javalin.Javalin;
import io.javalin.embeddedserver.Location;
import io.marioslab.basis.site.BasisSite;
import io.marioslab.basis.site.Configuration;

public class MariosLab {
	public static void main (String[] args) {
		new Thread((Runnable) () -> {
			Configuration config = Configuration.parse(args);
			new BasisSite(config);
		}).start();

		Javalin app = Javalin.create().enableDynamicGzip().enableStaticFiles("output", Location.EXTERNAL).port(8000).start();
	}
}
