// export const arrIsSame = (a, b) => {
//   return (
//     a.length === b.length &&
//     a.sort().every((value, index) => {
//       return value === b.sort()[index];
//     })
//   );
// };

export const arrIsSame = (a, b) =>
  a.length === b.length &&
  [...a].sort().every((val, index) => val === [...b].sort()[index]);
