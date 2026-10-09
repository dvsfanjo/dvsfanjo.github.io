## Dilworth 定理



Dilworth 定理用于最小链覆盖问题，内容是“最小链覆盖数为最长反链长度”。



Dilworth 定理是针对一个有偏序关系的集合的，在一个子集中所有元素互相偏序，则该子集称为“链”；在一个子集中任意元素不能两两偏序，则该子集被称为“反链”。



## T2 题



给定 $n$ 堆树叶，每堆有参数 $(s_i,c_i)$ 表示树叶的体积和最大覆盖体积，且总有 $s_i>c_i$ 。



现在，第 $i$ 堆树叶可以被第 $j$ 堆覆盖，当且仅当第 $j$ 堆没有覆盖别的树叶，且 $c_j\ge s_i$ ，注意：每堆树叶只能覆盖至多一堆其他树叶，但被覆盖的树叶可以覆盖其他树叶且不算入自身体积。



对于每个 $i$ 求前 $[1,i]$ 堆树叶最少可以合并为几堆树叶。



首先可以将树叶的关系看作有向图，将 $i\to j$ 连接，表示 $i$ 可以被 $j$ 覆盖，结果变成求最小链覆盖，通过 Dilworth 定理转化为求最长反链长度。



偏序关系很显然可以看作 $c_i<s_i\le c_j<s_j$ 此时 $(i,j)$ 互相偏序，可以将 $i$ 被覆盖进 $j$ 中，链中任意区间无交，那么反链就要求其中任意两个区间有交。



问题转化成了每次加入一个区间 $[c_i,s_i)$ 求最多两两相交子集大小，其实就是在 $[c_i,s_i)$ 上 $+1$ 并查询全局最大值。



:::info[代码]

```cpp

#include <bits/stdc++.h>

#define int long long

using namespace std;

const int maxn = 2e5 + 5;

int n, s, c;

namespace seg {

	#define mid (l + r >> 1)

	int idx, root;

	struct node {

		int maxx, tag, ls, rs;

	} t[maxn << 6];

	inline void apply(int &u, int x) {

		if (!u) u = ++idx; 

		t[u].tag += x, t[u].maxx += x; 

	}

	inline void pushdown(int &u) {

		if (!t[u].tag) return;

		apply(t[u].ls, t[u].tag);

		apply(t[u].rs, t[u].tag);

		t[u].tag = 0;

	}

	void update(int &u, int l, int r, int a, int b, int x) {

		if (!u) u = ++idx;

		if (a <= l && r <= b) return apply(u, x);

		pushdown(u);

		if (a <= mid) update(t[u].ls, l, mid, a, b, x);

		if (mid < b) update(t[u].rs, mid + 1, r, a, b, x);

		t[u].maxx = max(t[t[u].ls].maxx, t[t[u].rs].maxx);

	}

	#undef mid

	inline void Update(int l, int r, int x) { update(root, 1, 1000000000, l, r, x); }

	inline int Query() { return t[root].maxx; }

};

signed main() {

	freopen("leaf.in", "r", stdin);

	freopen("leaf.out", "w", stdout); 

	ios::sync_with_stdio(0);

	cin.tie(0), cout.tie(0);

	cin >> n;

	for (int i = 1; i <= n; i++) {

		cin >> s >> c;

		seg::Update(c, s - 1, 1);

		cout << seg::Query() << '\n';

	}

	return 0;

}

```

:::

