export const handlePlay = (url: string) => {
  new Audio(url).play().catch((e) => {
    console.log(e);
  });
};
