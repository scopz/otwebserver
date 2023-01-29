import { getElementById, querySelector, querySelectorAll, generateFromTemplate, ajax, createElement } from './_dom/dom-utils';

declare global {
  interface Window {
    players: any[]
  }
}

export function initManage() {
  window.players.forEach(player => {
    const clone = generateFromTemplate('pl-row')!;
    
    querySelector<HTMLTableRowElement>('tr', clone)?.setAttribute('playerId', player.id);

    const deleteButton = querySelector('.del button', clone);
    if (deleteButton) {
      deleteButton.onclick = ev => clickDelete(ev, player.id);
      deleteButton.oncontextmenu = ev => confirmDelete(ev, player.id);
    }

    fillRow(clone, [
      player.name,
      player.vocation,
      player.level
    ]);

    getElementById('pl-tbody')?.appendChild(clone);
  });

  const createCharButton = getElementById('create-char');
  if (createCharButton) {
    createCharButton.onclick = ev => location.pathname += '/create';
  }
  window.players = [];
}

let deleteConfirmation = -1;
let tooltip: HTMLDivElement | undefined;
let tooltipTimeout: NodeJS.Timeout | undefined;

function cleanToolTip() {
  if (tooltip) {
    tooltip.style.height = '0';
    tooltip.style.paddingTop = '0';
    tooltip.style.paddingBottom = '0';

    setTimeout(tooltip.remove.bind(tooltip), 200);
    clearTimeout(tooltipTimeout);
    tooltipTimeout = tooltip = undefined;
  }
}

function confirmDelete(ev: MouseEvent, id: number): false | void {
  if (deleteConfirmation == id) {
    cleanToolTip();
    callDeleteChar(`${id}`);
    return false;
  }
}

function clickDelete(ev: MouseEvent, id: number) {
  function px(value: number) {
    return `${value}px`;
  }

  cleanToolTip();
  tooltip = createElement('div', '#tooltip', document.body);
  tooltip.innerHTML = 'Are you sure you want to remove this character?<br/>Right click to confirm';

  const elementTarget = ev.target as HTMLElement;
  const rect = elementTarget.getBoundingClientRect();
  tooltip.style.left = px(rect.left-(tooltip.offsetWidth-rect.width)/2+1);
  tooltip.style.top = px(rect.bottom);
  tooltip.style.height = px(tooltip.offsetHeight-4);

  deleteConfirmation = id;
  tooltipTimeout = setTimeout(() => {
    deleteConfirmation = -1;
    cleanToolTip();
  }, 1500)
}

function callDeleteChar(id: string) {
  const pathname = location.pathname.replace(/\/+$/,'');
  ajax(pathname+'/delete', { id }, {method: 'POST'})
    .then(response => response.json())
    .then(json => {
      if (!json.success) {
        getElementById('message')!.textContent = json.msg;
      } else {
        querySelectorAll('tr')
          .find(tr => tr.getAttribute('playerId') == id)
          ?.remove();
      }
    });
}

function fillRow(element: HTMLElement, values: string[]) {
  querySelectorAll('td', element)
    .filter((td, i) => values[i])
    .forEach((td, i) => td.textContent = values[i])
}

initManage();