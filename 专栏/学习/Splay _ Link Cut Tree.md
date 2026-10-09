## 前言



其实在 2024 年那会已经写过一次，但是因为当时还没开智导致已知不懂，而现在正在继续但不想写 counting 题所以来补之前没学会的东西。



2026.08.04 



by dvsfanjo



## Splay



### 性质/维护



splay 和 treap 一样都是一种平衡 BST ，但 treap 以随机权值维护堆来平衡， splay 以伸展操作维护。



现在维护一个结点的左右儿子、存的元素、子树大小和父亲结点，除此之外维护用于新建结点的编号和根节点。



为了方便有一个判断一个结点是左/右儿子函数 ```dir``` ，和一个更新结点子树大小的函数 ```pushup``` 。



```cpp

int root, idx, fa[maxn], ch[maxn][2], val[maxn], siz[maxn];

inline bool dir(int u) { return u == ch[fa[u]][1]; }

inline void pushup(int u) { siz[u] = siz[ch[u][0]] + siz[ch[u][1]] + 1; }



```



### 旋转



对一个结点旋转要确保不会改变 splay 的中序遍历和每个结点维护的信息，旋转操作可以将一个结点向上放，具体的，分为左旋和右旋。



![](https://cdn.luogu.com.cn/upload/image_hosting/0hl3zyoc.png)



如图为了维护中序遍历，设有结点 $x$，$y$，$f$ 和子树 $a$，$b$，$c$ 。



1. 如左图 $x$ 是 $y$ 左儿子时右旋向上，将 $y$ 左儿子连向 $x$ 的右儿子，将 $x$ 的右儿子连向 $y$ ，将 $f$ 的原先连向 $y$ 的边连向 $x$ 。

2. 如右图 $y$ 是 $x$ 右儿子时左旋向上，将 $x$ 右儿子连向 $y$ 的左儿子，将 $y$ 的左儿子连向 $x$ ，将 $f$ 的原先连向 $x$ 的边连向 $y$ 。



总体来说左旋右旋很相似，可以写在一起。



```cpp

void rotate(int u) {

	int v = fa[u], f = fa[v], r = dir(u);

	ch[v][r] = ch[u][r ^ 1], ch[u][r ^ 1] = v;

	if (f) ch[f][dir(v)] = u;

	if (ch[v][r]) fa[ch[v][r]] = v;

	fa[v] = u, fa[u] = f;

	pushup(v), pushup(u); 

}

```



### 伸展



伸展操作 ```splay(u,k)``` 表示将结点 $u$ 旋转至 $k$ 的下方，特殊的，当 $k$ 为 $0$ 时表示将 $u$ 转至根。具体的我们可以递归或循环实现，只要看每次如何把 $x$ 的父亲 $y$ 和 $y$ 的父亲 $f$ 都压到 $x$ 下即可，分为两种情况。



一种是 $x$，$y$，$f$ 在一条直链上，一种是 $x$，$y$，$f$ 在一条折链上。



![](https://cdn.luogu.com.cn/upload/image_hosting/iopeygmc.png)



第一种情况先旋 $y$ 在旋 $x$ ，第二种旋两次 $x$ 即可。



```cpp

void splay(int u, int k) {

	while (fa[u] ^ k) {

		int v = fa[u], f = fa[v];

		if (f ^ k) rotate(dir(u) ^ dir(v) ? u : v);

		rotate(u);

	}

	if (!k) root = x;

}

```



伸展操作是 splay 保持平衡的核心操作，每次进行平衡树操作后都做一次伸展可以保证单次时间复杂度均摊 $O(\log n)$ ，证明要使能分析我不会。



至此 splay 的基础操作没了，接下来平衡树相关的操作都基于 BST 的性质和伸展、旋转操作。



### 平衡树操作



插入、查找等东西基于 BST 不多赘述（还没调出来）



upd 2026.09.27 调出来了，是 get_pre 走的结点反了



```cpp

namespace Splay {

	int root, idx, fa[maxn], ch[maxn][2], val[maxn], siz[maxn];

	inline void clear(int u) { 

      fa[u] = ch[u][0] = ch[u][1] = val[u] = siz[u] = 0; 

  }

	inline bool dir(int u) { 

      return u == ch[fa[u]][1]; 

  }

	inline void pushup(int u) { 

      siz[u] = siz[ch[u][0]] + siz[ch[u][1]] + 1; 

  }

	void rotate(int u) {

		int v = fa[u], f = fa[v], r = dir(u);

		ch[v][r] = ch[u][r ^ 1], ch[u][r ^ 1] = v;

		if (f) ch[f][dir(v)] = u;

		if (ch[v][r]) fa[ch[v][r]] = v;

		fa[v] = u, fa[u] = f;

		pushup(v), pushup(u); 

	}

	void splay(int u, int k) {

		if (!u) return;

		while (fa[u] != k) {

			int v = fa[u], f = fa[v];

			if (f ^ k) rotate(dir(u) ^ dir(v) ? u : v);

			rotate(u);

		}

		if (!k) root = u;

	}

	void insert(int v) {

		int u = root, p = 0;

		while (u) p = u, u = ch[u][v > val[u]];

		u = ++idx;

		if (p) ch[p][v > val[p]] = u;

		fa[u] = p, val[u] = v, siz[u] = 1;

		splay(u, 0);

	}

	void erase(int v) {

		int u = root, p = 0;

		while (val[u] != v && u) p = u, u = ch[u][v > val[u]];

		if (!u) return splay(p, 0), void(); splay(u, 0);

		int cur = ch[u][0];

		if (!cur) return root = ch[u][1], fa[ch[u][1]] = 0, clear(u), void();

		while (ch[cur][1]) cur = ch[cur][1];

		ch[cur][1] = ch[u][1], fa[ch[u][1]] = cur, fa[ch[u][0]] = 0, clear(u);

		return pushup(cur), splay(cur, 0), void();

	}

	int get_rank(int v) {

		int ans = 1, u = root, p = 0;

		while (u) {

			p = u;

			if (val[u] < v) ans += siz[ch[u][0]] + 1;

			u = ch[u][v > val[u]];

		}

		return splay(p, 0), ans;

	}

	int get_kth(int k) {

		int u = root;

		while (u) {

			int tmp = siz[ch[u][0]] + 1;

			if (k < tmp) u = ch[u][0];

			else if (k == tmp) break;

			else k -= tmp, u = ch[u][1];

		}

		return splay(u, 0), val[u];

	}

	int get_pre(int v) {

		int u = root, p = 0, ans = 0;

		while (u) {

			p = u;

			if (v > val[u]) ans = val[u], u = ch[u][1];

			else u = ch[u][0];

		}

		return splay(p, 0), ans;

	}

	int get_suc(int v) {

		int u = root, p = 0, ans = 0;

		while (u) {

			p = u;

			if (v < val[u]) ans = val[u], u = ch[u][0];

			else u = ch[u][1]; 

		}

		return splay(p, 0), ans;

	}

};

```



## Link Cut Tree



现在已经是 2026.09.27 了，停了一两个月再写这篇文章，顺路自学了一下 Link Cut Tree 。



### LCT 操作



```cpp

namespace LCT {

	int ch[maxn][2], fa[maxn], val[maxn], sum[maxn], tag[maxn];

	inline bool isroot(int u) { 

		return ch[fa[u]][0] != u && ch[fa[u]][1] != u; 

	}

	inline void pushup(int u) { 

		sum[u] = val[u] ^ sum[ch[u][0]] ^ sum[ch[u][1]]; 

	};

	inline void apply(int u) { 

		if (u) swap(ch[u][0], ch[u][1]), tag[u] ^= 1; 

	}

	inline void pushdown(int u) { 

		if (tag[u]) apply(ch[u][0]), apply(ch[u][1]), tag[u] = 0; 

	}

	inline bool dir(int u) { 

		return u == ch[fa[u]][1]; 

	}

	void rotate(int u) {

		int v = fa[u], f = fa[v], r = dir(u);

		if (!isroot(v)) ch[f][dir(v)] = u;

		fa[u] = f, ch[v][r] = ch[u][r ^ 1];

		if (ch[u][r ^ 1]) fa[ch[u][r ^ 1]] = v;

		ch[u][r ^ 1] = v, fa[v] = u;

		pushup(v), pushup(u);

	}

	void splay(int u) {

		stack <int> st; st.push(u);

		int v = u;

		while (!isroot(v)) st.push(v = fa[v]);

		while (st.size()) pushdown(st.top()), st.pop();

		while (!isroot(u)) {

			int v = fa[u], f = fa[v];

			if (!isroot(v)) {

				if (dir(u) == dir(v)) rotate(v);

				else rotate(u);

			}

			rotate(u);

		}

		pushup(u);

	}

	inline void access(int u, int v = 0) { 

		while (u) {

			splay(u), ch[u][1] = v, pushup(u);

			v = u, u = fa[u]; 

		}

	}

	inline int findroot(int u) { 

		access(u), splay(u); 

		while (ch[u][0]) pushdown(u), u = ch[u][0]; 

		return splay(u), u; 

	}

	inline void makeroot(int u) { 

		access(u), splay(u), apply(u); 

	}

	inline void link(int u, int v) { 

		makeroot(u); 

		if (findroot(v) != u) fa[u] = v; 

	}

	inline void cut(int u, int v) { 

		makeroot(u), access(v), splay(v);

		if (ch[v][0] == u && !ch[u][1]) {

			ch[v][0] = fa[u] = 0, pushup(v);

		} 

	}

	inline int query(int u, int v) { 

		makeroot(u), access(v), splay(v);

		return sum[v]; 

	}

	inline void update(int u, int x) {

		access(u), splay(u);

		val[u] = x, pushup(u);

	}

};

```

