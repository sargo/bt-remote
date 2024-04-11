const BtButtonValues = ['n', 'w', 'e', 's', 'a', 'b', 'x', 'y', 'c', 'd', 'a'];

enum BtButton {
  //% block="▲"
  North = 0,
  //% block="◀"
  West = 1,
  //% block="▶"
  East = 2,
  //% block="▼"
  South = 3,
  //% block="A"
  A = 4,
  //% block="B"
  B = 5,
  //% block="X"
  X = 6,
  //% block="Y"
  Y = 7,
  //% block="C"
  C = 8,
}

enum BtButtonAction {
  //% block="pressed"
  Pressed = 9,
  //% block="released"
  Released = 10,
}

//% color=#0fbc11 icon="\u272a" block="BT Remote"
//% category="Bluetooth"
namespace bluetooth {
  class BtButtonHandler {
    button: BtButton;
    action: BtButtonAction;
    onEvent: () => void;

    constructor(button: BtButton, action: BtButtonAction, onEvent: () => void) {
      this.button = button;
      this.action = action;
      this.onEvent = onEvent;
    }
  }

  const btRemoteHandlers: BtButtonHandler[] = [];
  let btRemoteConnected: boolean = false;

  /**
   * Connects to the BT remote.
   */
  //% subcategory="BT Remote"
  //% blockId="bt_remote_connect_bt_remote"
  //% block="connect BT Remote"
  //% pin.fieldEditor="gridpicker"
  //% pin.fieldOptions.columns=4
  //% pin.fieldOptions.tooltips="false"
  //% weight=90
  export function connectBtRemote(): void {
    bluetooth.startUartService();
    // FIXME - UART service do not start when it's alone, we have to start at least one other service
    bluetooth.startTemperatureService();

    bluetooth.onBluetoothConnected(function () {
      btRemoteConnected = true;
      while (btRemoteConnected) {
        const uartData = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Colon));
        serial.writeLine(uartData);
        if (uartData) {
          const [buttonName, actionName] = uartData.split('-');
          if (buttonName && actionName) {
            btRemoteHandlers
              .filter(
                (handler) =>
                  handler.button.toString() === `${BtButtonValues.indexOf(buttonName)}` &&
                  handler.action.toString() === `${BtButtonValues.indexOf(actionName)}`
              )
              .map((handler) => {
                control.inBackground(handler.onEvent);
              });
          }
        }
      }
    });
    bluetooth.onBluetoothDisconnected(function () {
      btRemoteConnected = false;
    });
  }

  /**
   * Do something when a specific button is pressed or released on the remote control.
   * @param button the button to be checked
   * @param action the trigger action
   * @param handler body code to run when the event is raised
   */
  //% subcategory="BT Remote"
  //% blockId=br_remote_on_bt_button
  //% block="on BT button | %button | %action"
  //% button.fieldEditor="gridpicker"
  //% button.fieldOptions.columns=3
  //% button.fieldOptions.tooltips="false"
  //% weight=50
  export function onBtButton(button: BtButton, action: BtButtonAction, handler: () => void) {
    btRemoteHandlers.push(new BtButtonHandler(button, action, handler));
  }
}
