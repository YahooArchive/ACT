# ACT.js Docs

This is an orphan branch that contains only documentation related files.


## Generating Docs

In order to generate new documentation, first checkout to the master or working branch, then generate the documentation
with Grunt on your local machine:

```
$ grunt docs
```

All generated files can be found in `./temp_*`. Because you are not tracking docs files with git, these files will be 
living just locally in your machine.

If you want to update the documentation and still are not tracking the remote gh-pages branch, first start tracking 
the remote branch with:

```
$ git checkout --track origin/gh-pages
```

or just checkout to gh-pages if you already have it locally.

```
$ git checkout gh-pages
```

And then, run
 
```
$ grunt
```

Now commit and push the changes (newly generated documentation).

The new documentation should be now available at 
https://yahoo.github.io/ACT/
