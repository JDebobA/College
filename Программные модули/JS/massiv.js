function id (matrix, target) {
    for (let i = 0; i < matrix.length; i++){
        const biba = matrix[i];
        const IdBiba = biba.indexOf(target)
        if (IdBiba !== -1) {
            return [i,IdBiba]
        };
    };
};


a = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
];

console.log(id(a, 3));