import { createElement, getElementsByClassName, addClass, toggleClass } from './_dom/dom-utils';

function initMenu() {
  getElementsByClassName('section').forEach(section => {
    const head = getElementsByClassName('head', section)[0];
    const links = getElementsByClassName('links', section)[0];

    const defaultLinksHeight = links.offsetHeight+'px';

    head.classList.onChange('hide', added =>
      links.style.height = added? '0' : defaultLinksHeight
    );

    head.onclick = () => toggleClass(head, 'hide');
    headStyling(head);

    const selected = ([...links.children] as HTMLAnchorElement[])
      .filter(a => location.href.indexOf(a.href) == 0)
      .peek(a => addClass(a, 'selected'))
      .length > 0;

    if (!selected) addClass(head, 'hide');
    else           links.style.height = defaultLinksHeight;
  });
}


function headStyling(head: HTMLElement){
  let text = head.textContent;
  head.clear();

  createElement('span', 'bg-animation', head);
  createElement('span', 'title', head).textContent = text;
}

initMenu();