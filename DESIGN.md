## Design

When first starting to work on this, a few points seemed especially important:
### Typing
For developers using the SDK, strong typing is invaluable when working in an editor. With the right editor setup a good SDK should convey the correct usage just through auto-correct and auto-complete alone.

### Documentation

All of the main class methods and important types are explained in Typedoc comments, so as to also be visible during development.

### API consistency

In this case we are working with an API with routes structured logically around five main data types. It was important to write an SDK that recreated this with a class-oriented framework, so developers already familiar with the API would be ready to go immediately.

Mirroring the API routes also allowed us to "chain" and group together API functionality in an immediately clear way - i.e. you can immediately tell the purpose of ```lotr.movie.withId('...').quotes()``` Doing this also allows the potential to add additional functionality later - i.e. if we wanted to later add ```lotr.movie.withId('...').characters()``` or the like.

### DRY

Since several of the top-level data types have overlapping logic - quotes for both movies and characters, for example - it was important to reuse critical logic both to reduce bloat and reduce the effort needed to update the libraries in the future.

## Things to Improve (with more time)
- Better and more comprehensive testing
- Generate Typedoc comments into a published documentation page
- Axios library was used for convenience, likely possible to replace with ```cross-fetch``` or similar
- Cache especially large queries
- Monitor server-side rate limiting and provide feedback if exceeded