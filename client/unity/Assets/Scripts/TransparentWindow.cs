using System;
// Used for importing system dlls
using System.Runtime.InteropServices;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TransparentWindow : MonoBehaviour
{
    // Used to create a Windows system message box
    [DllImport("user32.dll")]
    public static extern int MessageBox(IntPtr hWnd, string text, string caption, uint type);

    // Used to get the handle id of this window
    [DllImport("user32.dll")]
    private static extern IntPtr GetActiveWindow();

    // Used to set window flags
    [DllImport("user32.dll")]
    private static extern int SetWindowLong(IntPtr hWnd, int nIndex, uint dwNewLong);

    [DllImport("user32.dll", SetLastError = true)]
    static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);

    private struct MARGINS {
        public int cxLeftWidth;
        public int cxRightWidth;
        public int cyTopHeight;
        public int cyBottomHeight;
    }

    // Used to create a transparent background by giving margins a value of -1
    [DllImport("Dwmapi.dll")]
    private static extern uint DwmExtendFrameIntoClientArea(IntPtr hWnd, ref MARGINS margins);

    // type of option to affect in SetWindowLong()
    const int GWL_EXSTYLE = -20;

    const uint WS_EX_LAYERED = 0x00080000;
    const uint WS_EX_TRANSPARENT = 0x00000020;

    static readonly IntPtr HWND_TOPMOST = new IntPtr(-1);

    IntPtr windowHandle;

    private void Start() {
        // MessageBox(new IntPtr(), "Hello World!", "Hello Dialog", 0);

// This code will crash in the Unity editor, so prevents it from being run while in the editor
#if !UNITY_EDITOR
        windowHandle = GetActiveWindow();
        MARGINS margins = new MARGINS { cxLeftWidth = -1 };
        // Creates a transparent background on the current window by setting a margin to -1
        DwmExtendFrameIntoClientArea(windowHandle, ref margins);

        // Set clickthrough on current window
        SetWindowLong(windowHandle, GWL_EXSTYLE, WS_EX_LAYERED | WS_EX_TRANSPARENT);

        // Keeps window on top (maybe disable later)
        // SetWindowPos(hWnd, HWND_TOPMOST, 0, 0, 0, 0, 0);

        // Keeps app running even when in background
        Application.runInBackground = true;
#endif
    }

    private void Update() {
        // Enables clickthrough on current window by using the 2D physics engine to
        // check if our current mouse position is overlapping a collider
        SetClickthrough(Physics2D.OverlapPoint(CodeMonkey.Utils.UtilsClass.GetMouseWorldPosition()) == null);
    }

    // Allows clicks to pass through the window if clickthrough is true
    // Else, send clicks to the current window
    private void SetClickthrough(bool clickthrough) {
        if (clickthrough) {
            SetWindowLong(windowHandle, GWL_EXSTYLE, WS_EX_LAYERED | WS_EX_TRANSPARENT);
        } else {
            SetWindowLong(windowHandle, GWL_EXSTYLE, WS_EX_LAYERED);
        }
    }
}
