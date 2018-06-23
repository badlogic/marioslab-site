
package io.marioslab.site;

import io.marioslab.basis.site.BasisSite;
import io.marioslab.basis.site.Configuration;

public class MariosLab {
	public static void main (String[] args) {
		Configuration config = Configuration.parse(args);
		new BasisSite(config);
	}
}
