class Solution {
    public int[][] restoreMatrix(int[] rowSum, int[] colSum) {
        int r = rowSum.length;
        int c = colSum.length;
        int[]rSum = new int[r];
        int[]cSum = new int[c];
        int[][]matrix = new int[r][c];
        for (int i=0; i<r; i++) {
            for (int j=0; j<c; j++) {
                if (rSum[i]==rowSum[i] || cSum[j]==colSum[j]) {
                    matrix[i][j] = 0;
                }
                else {
                    if (rowSum[i]-rSum[i]<=colSum[j]-cSum[j]) {
                        matrix[i][j] = rowSum[i] - rSum[i];
                        rSum[i] += matrix[i][j];
                        cSum[j] += matrix[i][j];
                    }
                    else {
                        matrix[i][j] = colSum[j] - cSum[j];
                        cSum[j] += matrix[i][j];
                        rSum[i] += matrix[i][j];
                    }
                }
            }
        }
        return matrix;
    }
}
