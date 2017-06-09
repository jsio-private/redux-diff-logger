// https://github.com/flitbit/diff#differences
import differ from 'smf-deep-diff';
import chalk from 'chalk';


const STANDARD_CONSOLE = !console.group;


const dictionary = {
  E: {
    color: '#2196F3',
    text: 'CHANGED:',
    colorFn: chalk.blue.bold,
  },
  N: {
    color: '#4CAF50',
    text: 'ADDED:',
    colorFn: chalk.green.bold,
  },
  D: {
    color: '#F44336',
    text: 'DELETED:',
    colorFn: chalk.red.bold,
  },
  A: {
    color: '#2196F3',
    text: 'ARRAY:',
    colorFn: chalk.blue.bold,
  },
};


function renderObject(o) {
  return JSON.stringify(o);
}


function renderSingleDiff(diff) {
  const { kind, path, lhs, rhs, index, item } = diff;

  switch (kind) {
  case 'E':
    return `${path.join('.')} ${renderObject(lhs)} → ${renderObject(rhs)}`;
  case 'N':
    return `${path.join('.')} ${renderObject(rhs)}`;
  case 'D':
    return `${path.join('.')}`;
  case 'A': {
    // Lazy instanceof check
    const pathString = `${path.join('.')}[${index}]`;
    if (item && item.hasOwnProperty('rhs')) {
      const dictionaryItem = dictionary[item.kind];
      const kindString = STANDARD_CONSOLE ? dictionaryItem.colorFn(item.kind) : item.kind;
      if (item.hasOwnProperty('lhs')) {
        return `${pathString} ${kindString}: ${renderObject(item.lhs)} → ${renderObject(item.rhs)}`;
      }
      return `${pathString} ${kindString}: ${renderObject(item.rhs)}`;
    }
    return `${pathString} ${item}`;
  }
  default:
    return null;
  }
}


function render(header, diff) {
  if (STANDARD_CONSOLE) {
    console.log('—— diff start ——');
    console.log(header);
  } else {
    console.group(header);
  }

  if (diff) {
    for (let i = 0; i < diff.length; i++) {
      const elem = diff[i];
      const output = renderSingleDiff(elem);

      const kind = elem.kind;
      const dictionaryItem = dictionary[kind];
      if (STANDARD_CONSOLE) {
        console.log(
          dictionaryItem.colorFn(dictionaryItem.text),
          output
        );
      } else {
        console.log(
          `%c ${dictionaryItem.text}`,
          `color: ${dictionary[kind].color}; font-weight: bold`,
          output
        );
      }
    }
  } else {
    console.log('—— no diff ——');
  }

  if (STANDARD_CONSOLE) {
    console.log('—— diff end ——');
  } else {
    console.groupEnd();
  }
}


function logger({ getState }) {
  return (next) => (action) => {
    const prevState = getState();
    const returnValue = next(action);
    const newState = getState();
    const time = new Date();

    const diff = differ(prevState, newState);
    const header = (
      'diff @'
      + ` ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}.${time.getMilliseconds()}` +
      + ` ${action.type}`
    );
    render(header, diff);

    return returnValue;
  };
}


export default logger;
export { render, dictionary };
