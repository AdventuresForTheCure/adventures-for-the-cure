Option Explicit

Dim IE
Dim shell
Set shell = WScript.CreateObject("WScript.Shell")
Set IE = WScript.CreateObject("InternetExplorer.Application")
IE.Visible = True
shell.AppActivate IE
IE.Navigate "http://software.garmin.com/en-US/gcp.html"