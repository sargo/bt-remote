enum BtButton {
  //% block="▲"
  North = 'n',
  //% block="◀"
  West = 'w',
  //% block="▶"
  East = 'e',
  //% block="▼"
  South = 's',
  //% block="A"
  Button_A = 'a',
  //% block="B"
  Button_B = 'b',
  //% block="X"
  Button_X = 'x',
  //% block="Y"
  Button_Y = 'y',
  //% block="C"
  Button_C = 'c',
}

enum BtButtonAction {
  //% block="pressed"
  Pressed = 'd',
  //% block="released"
  Released = 'u',
}

//% color=#0fbc11 icon="\u272a" block="MakerBit"
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
        if (uartData) {
          const [button, action] = uartData.split('-');
          if (
            Object.values(BtButton).includes(button as any) &&
            Object.values(BtButtonAction).includes(action as any)
          ) {
            btRemoteHandlers
              .filter((h) => h.button === button && h.action === action)
              .map((h) => {
                background.schedule(h.onEvent, background.Thread.UserCallback, background.Mode.Once, 0);
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
