
package io.marioslab;

import java.security.MessageDigest;

import io.javalin.Javalin;
import io.javalin.embeddedserver.Location;
import io.marioslab.basis.site.BasisSite;
import io.marioslab.basis.site.Configuration;
import io.marioslab.basis.site.Configuration.ConfigurationExtension;

public class MariosLab {
	public static class MariosLabConfiguration implements ConfigurationExtension {
		private String password;

		@Override
		public int parseArgument (String[] args, int index) {
			if ("-p".equals(args[index])) {
				index++;
				if (args.length == index) BasisSite.fatalError("Expected an password via -p <password>", false);
				password = args[index];
				return index;
			}
			return -1;
		}

		@Override
		public void validate () {
			if (password == null) BasisSite.fatalError("Expected a password via -p <password>", false);
			if (password.isEmpty()) BasisSite.fatalError("Password must not be empty", false);
		}

		@Override
		public void printHelp () {
			System.out.println("-p <password>           The password for the reload endpoints.");
		}

		public String getPassword () {
			return password;
		}
	}

	public static void main (String[] args) {
		MariosLabConfiguration siteConfig = new MariosLabConfiguration();
		Configuration config = Configuration.parse(args, siteConfig);

		new Thread((Runnable) () -> {
			new BasisSite(config);
		}).start();

		Javalin app = Javalin.create().enableDynamicGzip().enableStaticFiles("output", Location.EXTERNAL).port(8000).start();

		app.get("/api/reloadhtml", ctx -> {
			String password = ctx.queryParam("password");
			if (MessageDigest.isEqual(siteConfig.password.getBytes(), password.getBytes())) {
				new ProcessBuilder().command("git", "pull").start();
				ctx.response().getWriter().println("OK.");
			}
		});

		app.get("/api/reload", ctx -> {
			String password = ctx.queryParam("password");
			if (MessageDigest.isEqual(siteConfig.password.getBytes(), password.getBytes())) {
				ctx.response().getWriter().println("OK.");
				ctx.response().getWriter().flush();
				BasisSite.log("Got an update. Shutting down.");
				System.exit(-1);
			}
		});
	}
}
