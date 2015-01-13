package com.barbador.icrclaims;
import java.io.IOException;
import javax.servlet.http.*;

@SuppressWarnings("serial")
public class ICR_ClaimsServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("text/plain");
		resp.getWriter().println("Hello, world");
	}
}
