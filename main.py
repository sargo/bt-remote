def on_bluetooth_connected():
    global connected, uartData
    basic.show_icon(IconNames.YES)
    connected = 1
    while connected == 1:
        uartData = bluetooth.uart_read_until(serial.delimiters(Delimiters.COLON))
        control.raise_event(EventBusSource.MES_DPAD_CONTROLLER_ID,
            uartDataToEvent(uartData))
bluetooth.on_bluetooth_connected(on_bluetooth_connected)

def on_mes_dpad_controller_id_button_a_down():
    basic.show_string("A")
control.on_event(EventBusSource.MES_DPAD_CONTROLLER_ID,
    EventBusValue.MES_DPAD_BUTTON_A_DOWN,
    on_mes_dpad_controller_id_button_a_down)

def on_bluetooth_disconnected():
    global connected
    basic.show_icon(IconNames.NO)
    connected = 0
bluetooth.on_bluetooth_disconnected(on_bluetooth_disconnected)

def uartDataToEvent(cmd: str):
    if cmd.includes("a-u"):
        return EventBusValue.MES_DPAD_BUTTON_A_UP
    elif cmd.includes("a-d"):
        return EventBusValue.MES_DPAD_BUTTON_A_DOWN
    elif cmd.includes("b-u"):
        return EventBusValue.MES_DPAD_BUTTON_B_UP
    elif cmd.includes("b-d"):
        return EventBusValue.MES_DPAD_BUTTON_B_DOWN
    elif cmd.includes("c-u"):
        return EventBusValue.MES_DPAD_BUTTON_C_UP
    elif cmd.includes("c-d"):
        return EventBusValue.MES_DPAD_BUTTON_C_DOWN
    elif cmd.includes("d-u"):
        return EventBusValue.MES_DPAD_BUTTON_D_UP
    elif cmd.includes("d-d"):
        return EventBusValue.MES_DPAD_BUTTON_D_DOWN
    elif cmd.includes("n-u"):
        return EventBusValue.MES_DPAD_BUTTON_1_UP
    elif cmd.includes("n-d"):
        return EventBusValue.MES_DPAD_BUTTON_1_DOWN
    elif cmd.includes("e-u"):
        return EventBusValue.MES_DPAD_BUTTON_2_UP
    elif cmd.includes("e-d"):
        return EventBusValue.MES_DPAD_BUTTON_2_DOWN
    elif cmd.includes("s-u"):
        return EventBusValue.MES_DPAD_BUTTON_3_UP
    elif cmd.includes("s-d"):
        return EventBusValue.MES_DPAD_BUTTON_3_DOWN
    elif cmd.includes("w-u"):
        return EventBusValue.MES_DPAD_BUTTON_4_UP
    elif cmd.includes("w-d"):
        return EventBusValue.MES_DPAD_BUTTON_4_DOWN
    return EventBusValue.MES_DEVICE_INCOMING_CALL

def on_mes_dpad_controller_id_button_a_up():
    basic.show_leds("""
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        """)
control.on_event(EventBusSource.MES_DPAD_CONTROLLER_ID,
    EventBusValue.MES_DPAD_BUTTON_A_UP,
    on_mes_dpad_controller_id_button_a_up)

def btInit():
    global event
    event = EventBusValue.MES_DEVICE_INCOMING_CALL
    bluetooth.start_uart_service()
    bluetooth.start_temperature_service()
event = 0
uartData = ""
connected = 0
btInit()
basic.show_icon(IconNames.HEART)