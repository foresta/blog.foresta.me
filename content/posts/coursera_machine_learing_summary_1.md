+++
date = "2017-09-27T08:05:13+09:00"
title = "coursera machine learing に必要だった数学知識"

tags = ["coursera", "機械学習"]
categories = ["engineering"]

draft = true
+++

courseraのmachine-learningコースを受講した結果ある程度数学が必要だったのでまとめます。

# 行列

## 行列の表現
$$
A = \begin{bmatrix} 
    a\_{11} & a\_{12} & a\_{13} \\\ 
    a\_{21} & a\_{22} & a\_{23} \\\ 
\end{bmatrix}
$$

## 転置
$$
A^T = \begin{bmatrix}
    a\_{11} & a\_{21} \\\ 
    a\_{12} & a\_{22} \\\ 
    a\_{13} & a\_{23}
\end{bmatrix}
$$

## 和

$$ 
\begin{bmatrix} a\_{11} & a\_{12} \\\ a\_{21} & a\_{22} \\\ \end{bmatrix} 
+ 
\begin{bmatrix} b\_{11} & b\_{12} \\\ b\_{21} & b\_{22} \\\ \end{bmatrix} 
= \begin{bmatrix} a\_{11} + b\_{11} & a\_{12} + b\_{12} \\\ a\_{21} + b\_{21} & a\_{22} + b\_{22}  \\\ \end{bmatrix} 
$$

## 積

$$ 
\begin{bmatrix} a\_{11} & a\_{12} \\\ a\_{21} & a\_{22} \\\ \end{bmatrix} 
\begin{bmatrix} b\_{11} & b\_{12} \\\ b\_{21} & b\_{22} \\\ \end{bmatrix} 
= \begin{bmatrix} a\_{11} b\_{11} + a\_{12} b\_{21} & a\_{11} b\_{12} + a\_{12} b\_{22} \\\ a\_{21} b\_{11} + a\_{22} b\_{21} & a\_{21} b\_{12} + a\_{22} b\_{22}  \\\ \end{bmatrix} 
$$

## アダマール積

$$ 
\begin{bmatrix} a\_{11} & a\_{12} \\\ a\_{21} & a\_{22} \\\ \end{bmatrix} 
\odot \begin{bmatrix} b\_{11} & b\_{12} \\\ b\_{21} & b\_{22} \\\ \end{bmatrix} 
= \begin{bmatrix} a\_{11} b\_{11} & a\_{12} b\_{12}  \\\ a\_{21} b\_{21} & a\_{22} b\_{22}  \\\ \end{bmatrix} 
$$

## 単位行列

$$
\begin{bmatrix} 1 & 0 & 0 \\\ 0 & 1 & 0 \\\ 0 & 0 & 1 \\\ \end{bmatrix}
$$

## 逆行列

$$
A A^{-1} = I
$$

となる$A^{-1}$

