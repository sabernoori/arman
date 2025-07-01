const puppeteer = require('puppeteer');

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Go to any URL you want to analyze
  await page.goto('https://armantether.webflow.io/transactions', { waitUntil: 'networkidle2' });

  // Define the function in the browser context, then invoke it
  const structure = await page.evaluate(() => {
    function getDOMStructureWithCSS(element = document.body, level = 0) {
      let structure = '';
      const indent = '  '.repeat(level);
      const classes = Array.from(element.classList).join('.');
      const id = element.id ? `#${element.id}` : '';
      const tag = element.tagName.toLowerCase();
      
      // Get computed styles
      const styles = window.getComputedStyle(element);
      const relevantStyles = [
          'display', 'position', 'width', 'height', 'margin', 'padding',
          'background', 'color', 'font-size', 'flex', 'grid',
          'border', 'border-radius', 'box-shadow', 'transform'
      ];
      
      const styleString = relevantStyles
          .filter(prop => styles.getPropertyValue(prop))
          .map(prop => `${prop}: ${styles.getPropertyValue(prop)};`)
          .join(' ');

      // Get responsive styles
      const breakpoints = [
          { width: 991, name: 'Tablet' },
          { width: 767, name: 'Mobile Landscape' },
          { width: 479, name: 'Mobile Portrait' }
      ];

      // Build element string
      structure += `${indent}${tag}${id}${classes ? `.${classes}` : ''} {\n`;
      structure += `${indent}  /* Desktop styles */\n`;
      structure += `${indent}  ${styleString}\n`;
      
      // Add media queries
      breakpoints.forEach(bp => {
          structure += `${indent}  /* ${bp.name} styles */\n`;
          structure += `${indent}  @media (max-width: ${bp.width}px) {\n`;
          structure += `${indent}    /* Add breakpoint-specific styles here */\n`;
          structure += `${indent}  }\n`;
      });
      
      structure += `${indent}}\n\n`;

      // Process children
      Array.from(element.children).forEach(child => {
        structure += getDOMStructureWithCSS(child, level + 1);
      });

      return structure;
    }

    // Call our function starting at the document.body
    return getDOMStructureWithCSS();
  });

  // Print result
  console.log(structure);

  await browser.close();
})();
