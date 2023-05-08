import en from './keys-en.js';
import ru from './keys-ru.js';
import exceptionsKeyCapsLockEnglish from './exceptionsKeyCapsLockEnglish.js';
import exceptionsKeyCapsLockRussian from './exceptionsKeyCapsLockRussian.js';
import exceptionsKeyShift from './exceptionsKeyShift.js';

let selectedLanguageMialiokhin = localStorage.getItem('selectedLanguageMialiokhin') || 'english';
let exceptionsKeyCapsLock = localStorage.getItem('exceptionsKeyCapsLock') || exceptionsKeyCapsLockEnglish;

const VirtualKeyboard = {
  elements: {
    main: null,
    input: null,
    keysContainer: null,
    info: null,
    keys: [],
    language: en,
  },

  properties: {
    capsLock: false,
    shift: false,
    shiftLeft: false,
    shiftRight: false,
    ctrlLeft: false,
    altLeft: false,
  },

  init() {
    // create elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');
    this.elements.input = document.createElement('textarea');
    this.elements.info = document.createElement('p');
    this.elements.main.classList.add('keyboard');
    this.elements.input.classList.add('keyboard__input');
    this.elements.input.placeholder = 'Click here';
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this.renderKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');
    this.elements.info.classList.add('keyboard__info');
    this.elements.info.innerHTML = this.checkInfo();

    // add to DOM
    this.elements.main.appendChild(this.elements.input);
    this.elements.main.appendChild(this.elements.keysContainer);
    this.elements.main.appendChild(this.elements.info);
    document.body.appendChild(this.elements.main);

    // add text to input
    this.output = document.querySelector('.keyboard__input');
  },

  renderKeys() {
    this.elements.language = selectedLanguageMialiokhin === 'english' ? en : ru;
    const fragment = document.createDocumentFragment();

    this.elements.language.forEach((key) => {
      const keyboardKey = document.createElement('button');
      const addTagBr = ['Backspace', 'Delete', 'Enter', 'ShiftRight'].indexOf(key.code) !== -1;
      keyboardKey.classList.add('keyboard__key');
      keyboardKey.dataset.code = key.code;
      keyboardKey.setAttribute('type', 'button');

      keyboardKey.addEventListener('click', () => {
        this.insertToInput(key.code, keyboardKey);
      });

      // chose style to key
      switch (key.code) {
        case 'Backspace':
          keyboardKey.classList.add('keyboard__key_large');
          keyboardKey.dataset.code = key.code;
          keyboardKey.innerHTML = key.normal;
          break;

        case 'Tab':
          keyboardKey.classList.add('keyboard__key_tab');
          keyboardKey.dataset.code = key.code;
          keyboardKey.innerHTML = key.normal;
          break;

        case 'Backslash':
          keyboardKey.classList.add('keyboard__key');
          keyboardKey.dataset.code = key.code;
          keyboardKey.innerHTML = key.normal;
          break;

        case 'CapsLock':
          keyboardKey.classList.add('keyboard__key_large');
          keyboardKey.dataset.code = key.code;
          keyboardKey.innerHTML = key.normal;
          break;

        case 'Enter':
          keyboardKey.classList.add('keyboard__key_large');
          keyboardKey.dataset.code = key.code;
          keyboardKey.innerHTML = key.normal;
          break;

        case 'ShiftLeft':
          keyboardKey.classList.add('keyboard__key_large');
          keyboardKey.dataset.code = key.code;
          keyboardKey.innerHTML = key.normal;
          break;

        case 'ShiftRight':
          keyboardKey.classList.add('keyboard__key_large');
          keyboardKey.dataset.code = key.code;
          keyboardKey.innerHTML = key.normal;
          break;

        case 'Space':
          keyboardKey.classList.add('keyboard__key_largest');
          keyboardKey.dataset.code = key.code;
          keyboardKey.innerHTML = key.normal;
          break;

        default:
          keyboardKey.innerHTML = key.normal;
          break;
      }

      fragment.appendChild(keyboardKey);

      if (addTagBr) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  // pressing a key on a physical keyboard highlights the key on the virtual keyboard
  handleEvent(e) {
    e.preventDefault();
    let pressedBtn;
    for (let i = 0; i < this.elements.keys.length; i++) {
      if (this.elements.keys[i].dataset.code === e.code) {
        pressedBtn = this.elements.keys[i];
        break;
      }
    }
    this.illuminateBtn(e, pressedBtn);
    if (e.type === 'keydown') {
      this.insertToInput(e.code, pressedBtn);
    }
  },

  // illuminate pressed button
  illuminateBtn(e, pressedBtn) {
    if (e.type === 'keydown') {
      if (pressedBtn) pressedBtn.classList.add('_active');
    } else if (pressedBtn) pressedBtn.classList.remove('_active');
  },

  // press buttons on virtual or physical keyboard
  insertToInput(code, pressedBtn) {
    let cursorPosition = this.output.selectionStart;
    const left = this.output.value.slice(0, cursorPosition);
    const right = this.output.value.slice(cursorPosition);

    switch (code) {
      case 'Backspace':
        this.output.value = `${left.slice(0, -1)}${right}`;
        cursorPosition -= 1;
        this.output.focus();
        break;

      case 'Delete':
        this.output.value = `${left}${right.slice(1)}`;
        this.output.focus();
        break;

      case 'Tab':
        this.output.value = `${left}\t${right}`;
        cursorPosition += 1;
        this.output.focus();
        break;

      case 'CapsLock':
        this.properties.capsLock = !this.properties.capsLock;
        this.keyCapsLock();
        pressedBtn.classList.toggle('_hold-active');
        this.output.focus();
        break;

      case 'ShiftLeft':
        if (!this.properties.shiftRight) {
          this.properties.shift = !this.properties.shift;
          this.properties.shiftLeft = !this.properties.shiftLeft;
          this.keyShift();
          this.keyShiftToCaps();
          pressedBtn.classList.toggle('_hold-active');
        }

        this.output.focus();
        break;

      case 'ShiftRight':
        if (!this.properties.shiftLeft) {
          this.properties.shift = !this.properties.shift;
          this.properties.shiftRight = !this.properties.shiftRight;
          this.keyShift();
          this.keyShiftToCaps();
          pressedBtn.classList.toggle('_hold-active');
        }
        this.output.focus();
        break;

      case 'Enter':
        this.output.value = `${left}\n${right}`;
        cursorPosition += 1;
        this.output.focus();
        break;

      case 'MetaLeft':
        this.output.value = `${left}${right}`;
        this.output.focus();
        break;

      case 'Space':
        this.output.value = `${left} ${right}`;
        cursorPosition += 1;
        this.output.focus();
        break;

      case 'ArrowLeft':
        cursorPosition = cursorPosition - 1 >= 0 ? cursorPosition - 1 : 0;
        this.output.focus();
        break;

      case 'ArrowRight':
        cursorPosition += 1;
        this.output.focus();
        break;

      case 'ArrowUp':
        cursorPosition = this.arrowUp(cursorPosition);
        this.output.focus();
        break;

      case 'ArrowDown':
        cursorPosition = this.arrowDown(cursorPosition);
        this.output.focus();
        break;

      case 'ControlLeft':
        this.properties.ctrlLeft = !this.properties.ctrlLeft;
        this.changeLanguages();
        this.output.focus();
        break;

      case 'AltLeft':
        this.properties.altLeft = !this.properties.altLeft;
        this.changeLanguages();
        this.output.focus();
        break;

      case 'ControlRight':
        this.output.value = `${left}${right}`;
        this.output.focus();
        break;

      case 'AltRight':
        this.output.value = `${left}${right}`;
        this.output.focus();
        break;

      default:
        cursorPosition += 1;
        if (pressedBtn) this.output.value = `${left}${pressedBtn.innerHTML || ''}${right}`;
        this.output.focus();
        break;
    }

    this.output.setSelectionRange(cursorPosition, cursorPosition);
  },

  changeLanguages() {
    if (this.properties.ctrlLeft && this.properties.altLeft) {
      this.elements.language = selectedLanguageMialiokhin === 'english' ? ru : en;
      selectedLanguageMialiokhin = selectedLanguageMialiokhin === 'english' ? 'russian' : 'english';
      exceptionsKeyCapsLock = exceptionsKeyCapsLock === exceptionsKeyCapsLockEnglish
        ? exceptionsKeyCapsLockRussian
        : exceptionsKeyCapsLockEnglish;
      localStorage.setItem(
        'selectedLanguageMialiokhin',
        selectedLanguageMialiokhin,
      );
      localStorage.setItem('exceptionsKeyCapsLock', exceptionsKeyCapsLock);

      this.elements.info.innerHTML = this.checkInfo();

      for (const key of this.elements.keys) {
        const thisKey = this.elements.language.find(
          (element) => element.code === key.dataset.code,
        );
        key.innerHTML = thisKey.normal;
      }
      if (this.properties.capsLock && !this.properties.shift) {
        this.keyCapsLock();
      }
      if (!this.properties.capsLock && this.properties.shift) {
        this.keyShift();
        this.keyShiftToCaps();
      }
      if (this.properties.capsLock && this.properties.shift) {
        this.keyShift();
        this.keyCapsLock();
      }
      this.properties.ctrlLeft = !this.properties.ctrlLeft;
      this.properties.altLeft = !this.properties.altLeft;
    }
  },

  checkInfo() {
    switch (selectedLanguageMialiokhin) {
      case 'english':
        return 'The keyboard was created in the Windows operating system. To switch the language use combination: left ctrl + left alt';

      case 'russian':
        return 'Клавиатура создана в операционной системе Windows. Для переключения языка комбинация: левыe ctrl + alt';

      default:
        return 'The keyboard was created in the Windows operating system. To switch the language use combination: left ctrl + left alt';
    }
  },

  keyShift() {
    for (const key of this.elements.keys) {
      if (!exceptionsKeyShift.includes(key.dataset.code)) {
        const thisKey = this.elements.language.find(
          (element) => element.code === key.dataset.code,
        );
        if (this.properties.shift) {
          key.innerHTML = thisKey.shift;
        } else {
          key.innerHTML = thisKey.normal;
        }
      }
    }
  },

  keyShiftToCaps() {
    for (const key of this.elements.keys) {
      if (!exceptionsKeyCapsLock.includes(key.dataset.code)) {
        if (!this.properties.capsLock) {
          if (this.properties.shift) {
            key.innerHTML = key.textContent.toUpperCase();
          } else {
            key.innerHTML = key.textContent.toLowerCase();
          }
        }
        if (this.properties.capsLock) {
          if (this.properties.shift) {
            key.innerHTML = key.textContent.toLowerCase();
          } else {
            key.innerHTML = key.textContent.toUpperCase();
          }
        }
      }
    }
  },

  keyCapsLock() {
    for (const key of this.elements.keys) {
      if (!exceptionsKeyCapsLock.includes(key.dataset.code)) {
        if (this.properties.shift) {
          if (this.properties.capsLock) {
            key.innerHTML = key.textContent.toLowerCase();
          } else {
            key.innerHTML = key.textContent.toUpperCase();
          }
        }
        if (!this.properties.shift) {
          if (this.properties.capsLock) {
            key.innerHTML = key.textContent.toUpperCase();
          } else {
            key.innerHTML = key.textContent.toLowerCase();
          }
        }
      }
    }
  },

  arrowUp(cursorPosition) {
    const lines = this.output.value.split('\n');
    const currentLineIndex = this.getCurrentLineIndex();
    const currentCursorIndexInLine = this.getCursorPosInLine();
    if (currentLineIndex > 0) {
      // Перемещаем курсор на строку выше
      if (
        lines[currentLineIndex].length < lines[currentLineIndex - 1].length
        && currentCursorIndexInLine === lines[currentLineIndex].length
      ) {
        cursorPosition = cursorPosition
          - 1
          - currentCursorIndexInLine
          - (lines[currentLineIndex - 1].length - currentCursorIndexInLine);
      } else if (
        lines[currentLineIndex].length > lines[currentLineIndex - 1].length
        && currentCursorIndexInLine === lines[currentLineIndex].length
        && lines[currentLineIndex - 1].length !== 0
      ) {
        cursorPosition = cursorPosition - lines[currentLineIndex].length - 1;
      } else if (
        currentCursorIndexInLine !== lines[currentLineIndex].length
        && lines[currentLineIndex - 1].length !== 0
        && currentCursorIndexInLine < lines[currentLineIndex - 1].length
      ) {
        cursorPosition = cursorPosition
          - 1
          - currentCursorIndexInLine
          - (lines[currentLineIndex - 1].length - currentCursorIndexInLine);
      } else if (
        currentCursorIndexInLine !== lines[currentLineIndex].length
        && lines[currentLineIndex - 1].length !== 0
        && currentCursorIndexInLine > lines[currentLineIndex - 1].length
      ) {
        cursorPosition = cursorPosition - 1 - currentCursorIndexInLine;
      } else if (lines[currentLineIndex - 1].length === 0) {
        cursorPosition = cursorPosition - currentCursorIndexInLine - 1;
      } else if (
        currentCursorIndexInLine === lines[currentLineIndex - 1].length
      ) {
        cursorPosition = cursorPosition - currentCursorIndexInLine - 1;
      } else if (cursorPosition < 0) {
        cursorPosition = 0;
      }
    }
    return cursorPosition;
  },

  arrowDown(cursorPosition) {
    const lines = this.output.value.split('\n');
    const currentLineIndex = this.getCurrentLineIndex();
    const currentCursorIndexInLine = this.getCursorPosInLine();
    if (currentLineIndex < lines.length - 1) {
      // Перемещаем курсор на строку ниже
      if (
        lines[currentLineIndex].length < lines[currentLineIndex + 1].length
        && currentCursorIndexInLine === lines[currentLineIndex].length
      ) {
        cursorPosition = cursorPosition + currentCursorIndexInLine + 1;
      } else if (
        currentCursorIndexInLine === lines[currentLineIndex + 1].length
      ) {
        cursorPosition = cursorPosition
          + 1
          + (lines[currentLineIndex].length - currentCursorIndexInLine)
          + lines[currentLineIndex + 1].length;
      } else if (
        lines[currentLineIndex].length > lines[currentLineIndex + 1].length
        && currentCursorIndexInLine === lines[currentLineIndex].length
        && lines[currentLineIndex + 1].length !== 0
      ) {
        cursorPosition = cursorPosition + lines[currentLineIndex + 1].length + 1;
      } else if (
        currentCursorIndexInLine !== lines[currentLineIndex].length
        && lines[currentLineIndex + 1].length !== 0
        && currentCursorIndexInLine < lines[currentLineIndex + 1].length
      ) {
        cursorPosition = cursorPosition
          + 1
          + currentCursorIndexInLine
          + (lines[currentLineIndex].length - currentCursorIndexInLine);
      } else if (
        currentCursorIndexInLine !== lines[currentLineIndex].length
        && lines[currentLineIndex + 1].length !== 0
        && currentCursorIndexInLine > lines[currentLineIndex + 1].length
      ) {
        cursorPosition = cursorPosition
          + 1
          + (lines[currentLineIndex].length - currentCursorIndexInLine)
          + lines[currentLineIndex + 1].length;
      } else if (lines[currentLineIndex + 1].length === 0) {
        cursorPosition = cursorPosition
          + (lines[currentLineIndex].length - currentCursorIndexInLine)
          + 1;
      } else if (
        currentCursorIndexInLine === lines[currentLineIndex + 1].length
      ) {
        cursorPosition = cursorPosition + currentCursorIndexInLine + 1;
      } else if (cursorPosition === lines.length - 1) {
        cursorPosition = lines.length - 2;
      }
    }
    return cursorPosition;
  },

  getCurrentLineIndex() {
    const lines = this.output.value.split('\n');
    let cursorPosition = this.output.selectionStart;
    let currentLineIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (cursorPosition <= lines[i].length) {
        currentLineIndex = i;
        break;
      }
      cursorPosition -= lines[i].length + 1;
    }
    return currentLineIndex;
  },
  getCursorPosInLine() {
    const cursorPosition = this.output.selectionStart;
    const value = this.output.value.slice(0, cursorPosition);
    const lineBreakPos = value.lastIndexOf('\n');

    return lineBreakPos === -1
      ? cursorPosition
      : cursorPosition - lineBreakPos - 1;
  },
};
window.addEventListener('DOMContentLoaded', () => {
  VirtualKeyboard.init();
});
document.addEventListener(
  'keydown',
  VirtualKeyboard.handleEvent.bind(VirtualKeyboard),
);
document.addEventListener(
  'keyup',
  VirtualKeyboard.handleEvent.bind(VirtualKeyboard),
);
