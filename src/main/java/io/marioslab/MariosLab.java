
package io.marioslab;

import java.security.MessageDigest;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

		app.post("/api/githook", ctx -> {
			String json = ctx.formParam("payload");
			Pattern pattern = Pattern.compile("\\\"secret\\\"\\: \\\"(.*)\\\"");
			Matcher matcher = pattern.matcher(json);
			if (matcher.matches()) {
				BasisSite.log("Match: " + matcher.group(1));
				String password = matcher.group(1);
				if (MessageDigest.isEqual(siteConfig.password.getBytes(), password.getBytes())) {
					BasisSite.log("Got an update. Shutting down.");
					System.exit(-1);
				}
			} else {
				System.out.println("Fucking hell");
			}
		});
	}
}
