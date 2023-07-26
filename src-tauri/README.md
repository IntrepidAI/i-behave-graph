## Requirements

As a general tip if you get things like "failed to load module" and just in general if it seems like
you might be missing some dependency, the easiest way to find out what you might need to install is
by going to https://packages.ubuntu.com/ and use Search the contents of packages for things related
to what's missing, in this case searching for window-decorations shows us that kde-config-gtk-style
is the most likely candidate for being what's missing

When get this warnings

```
Gtk-Message: 18:52:43.575: Failed to load module "colorreload-gtk-module"
Gtk-Message: 18:52:43.575: Failed to load module "window-decorations-gtk-module"
Gtk-Message: 18:52:43.710: Failed to load module "colorreload-gtk-module"
Gtk-Message: 18:52:43.710: Failed to load module "window-decorations-gtk-module"
```

Install with

`sudo apt install kde-config-gtk-style`

and re-run `cargo tauri build` w/o (`--debug`)
