package be.pickitup.renderer;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;

import com.sun.faces.renderkit.html_basic.TextRenderer;

public class InputRenderer extends TextRenderer {

	@Override
	protected void getEndTextToRender(FacesContext context,
			UIComponent component,
			String currentValue)
			throws java.io.IOException {

		String[] attributes = { "placeholder", "data-theme", "data-format", "data-date-format" };

		ResponseWriter writer = context.getResponseWriter();

		for (String attribute : attributes)
		{
			String value = (String) component.getAttributes().get(attribute);
			if (value != null) {
				writer.writeAttribute(attribute, value, attribute);
			}
		}

		super.getEndTextToRender(context, component, currentValue);

	}
}