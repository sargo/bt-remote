bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Yes)
    connected = 1
    while (connected == 1) {
        uartData = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Colon))
        control.raiseEvent(
        EventBusSource.MES_DPAD_CONTROLLER_ID,
        uartDataToEvent(uartData)
        )
    }
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.No)
    connected = 0
})
control.onEvent(EventBusSource.MES_DPAD_CONTROLLER_ID, EventBusValue.MES_DPAD_BUTTON_A_DOWN, function () {
    basic.showString("A")
})
function uartDataToEvent (cmd: string) {
    if (cmd.includes("a-u")) {
        return EventBusValue.MES_DPAD_BUTTON_A_UP
    } else if (cmd.includes("a-d")) {
        return EventBusValue.MES_DPAD_BUTTON_A_DOWN
    } else if (cmd.includes("b-u")) {
        return EventBusValue.MES_DPAD_BUTTON_B_UP
    } else if (cmd.includes("b-d")) {
        return EventBusValue.MES_DPAD_BUTTON_B_DOWN
    } else if (cmd.includes("c-u")) {
        return EventBusValue.MICROBIT_BUTTON_EVT_UP
    } else if (cmd.includes("c-d")) {
        return EventBusValue.MICROBIT_BUTTON_EVT_DOWN
    } else if (cmd.includes("x-u")) {
        return EventBusValue.MES_DPAD_BUTTON_C_UP
    } else if (cmd.includes("x-d")) {
        return EventBusValue.MES_DPAD_BUTTON_C_DOWN
    } else if (cmd.includes("y-u")) {
        return EventBusValue.MES_DPAD_BUTTON_D_UP
    } else if (cmd.includes("y-d")) {
        return EventBusValue.MES_DPAD_BUTTON_D_DOWN
    } else if (cmd.includes("n-u")) {
        return EventBusValue.MES_DPAD_BUTTON_1_UP
    } else if (cmd.includes("n-d")) {
        return EventBusValue.MES_DPAD_BUTTON_1_DOWN
    } else if (cmd.includes("e-u")) {
        return EventBusValue.MES_DPAD_BUTTON_2_UP
    } else if (cmd.includes("e-d")) {
        return EventBusValue.MES_DPAD_BUTTON_2_DOWN
    } else if (cmd.includes("s-u")) {
        return EventBusValue.MES_DPAD_BUTTON_3_UP
    } else if (cmd.includes("s-d")) {
        return EventBusValue.MES_DPAD_BUTTON_3_DOWN
    } else if (cmd.includes("w-u")) {
        return EventBusValue.MES_DPAD_BUTTON_4_UP
    } else if (cmd.includes("w-d")) {
        return EventBusValue.MES_DPAD_BUTTON_4_DOWN
    }
    return EventBusValue.MES_DEVICE_INCOMING_CALL
}
control.onEvent(EventBusSource.MES_DPAD_CONTROLLER_ID, EventBusValue.MES_DPAD_BUTTON_A_UP, function () {
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
})
function btInit () {
    event = EventBusValue.MES_DEVICE_INCOMING_CALL
    bluetooth.startUartService()
    bluetooth.startTemperatureService()
}
let event = 0
let uartData = ""
let connected = 0
btInit()
basic.showIcon(IconNames.Heart)
