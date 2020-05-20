/*
 * Page JavaScript
 *
 * @author:     jim
 */

/*
 * Page initialization method.
 */
function init() {
    jQuery("div.header a.dropdown-trigger").dropdown({ coverTrigger: false });
}

// On Page Ready call Init Method
jQuery(document).ready(init);
