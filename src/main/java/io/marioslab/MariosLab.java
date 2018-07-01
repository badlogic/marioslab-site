
package io.marioslab;

import java.security.MessageDigest;

import com.esotericsoftware.minlog.Log;

import io.javalin.Javalin;
import io.javalin.embeddedserver.Location;
import io.marioslab.basis.arguments.ArgumentWithValue.StringArgument;
import io.marioslab.basis.arguments.Arguments;
import io.marioslab.basis.arguments.Arguments.ParsedArguments;
import io.marioslab.basis.site.BasisSite;

public class MariosLab {
	public static void main (String[] cliArgs) {
		Arguments args = BasisSite.createDefaultArguments();
		StringArgument passwordArg = args.addArgument(new StringArgument("-p", "Password that must be provided for reload endpoints.", "<password>", false));

		ParsedArguments parsed = null;
		byte[] password = null;
		BasisSite site = null;
		try {
			parsed = args.parse(cliArgs);
			password = parsed.getValue(passwordArg).getBytes("UTF-8");
			site = new BasisSite(parsed);
		} catch (Throwable e) {
			Log.error(e.getMessage());
			Log.debug("Exception", e);
			args.printHelp();
			System.exit(-1);
		}

		BasisSite finalSite = site;
		byte[] finalPassword = password;
		new Thread((Runnable) () -> {
			try {
				finalSite.generate();
			} catch (Throwable t) {
				Log.error(t.getMessage());
				Log.debug("Exception", t);
			}
		}).start();

		Javalin app = Javalin.create().enableDynamicGzip().enableStaticFiles("output", Location.EXTERNAL).port(8000).start();

		app.get("/api/reloadhtml", ctx -> {
			String pwd = ctx.queryParam("password");
			if (MessageDigest.isEqual(pwd.getBytes(), finalPassword)) {
				new ProcessBuilder().command("git", "pull").start();
				Log.info("Got new static content.");
				ctx.response().getWriter().println("OK.");
			}
		});

		app.get("/api/reload", ctx -> {
			String pwd = ctx.queryParam("password");
			if (MessageDigest.isEqual(pwd.getBytes(), finalPassword)) {
				ctx.response().getWriter().println("OK.");
				ctx.response().getWriter().flush();
				Log.info("Got an update. Shutting down.");
				System.exit(-1);
			}
		});
	}
}
