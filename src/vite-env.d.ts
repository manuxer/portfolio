/// <reference types="vite/client" />

declare module "*?responsive" {
  const picture: import("./lib/image").Picture;
  export default picture;
}
