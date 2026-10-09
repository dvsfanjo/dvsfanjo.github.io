## 思路



首先看到将其一分为二成 $L$ 和 $R$ 两个集合，自然而然想到可能是一个二分图染色问题，考虑将其转化为图论问题，具体来说就是怎样建图可以得到两边点数相同的二分图。



排除一个特殊情况，当一种元素出现次数为奇数时一定无解。



首先要保证一个序列恰好被分成大小相同的两半，于是考虑将序列中相邻两个位置连边；其次要保证一种元素被分成大小相同的两半，于是考虑将同种元素相邻位置连边。



如何证明这是一个二分图？建图之后一个位置一定连着一条“位置边”和一条“元素边”，一个联通块中每个结点的度为为 $2$ 所以连通块是环，走下去一定是两种边交替出现，所以是偶环，则原图为二分图。



现在就简单了，在跑二分图染色即可划分为两个集合。



## 代码



```cpp

#include <bits/stdc++.h>

#define int long long

#define fi first

#define se second

using namespace std;

const int maxn = 2e5 + 5;

int m, n[maxn], idx, lsh[maxn], tot, cnt, head[maxn];

bool vis[maxn], col[maxn];

vector <int> pos[maxn];

struct edge {

	int to, nxt;

} e[maxn << 1];

void add_edge(int u, int v) {

	e[++cnt] = {v, head[u]}, head[u] = cnt;

	e[++cnt] = {u, head[v]}, head[v] = cnt;

}

void dfs(int u) {

	vis[u] = true;

	for (int i = head[u]; i; i = e[i].nxt) {

		int v = e[i].to;

		if (vis[v]) continue;

		col[v] = col[u] ^ 1;

		dfs(v);

	}

}

signed main() {

	ios::sync_with_stdio(0);

	cin.tie(0), cout.tie(0);

	cin >> m;

	vector <vector <pair <int, int>>> a(m + 1);

	for (int i = 1; i <= m; i++) {

		cin >> n[i];

		vector <pair <int, int>> vec(n[i] + 1);

		for (int j = 1, x; j <= n[i]; j++) {

			cin >> x, lsh[++tot] = x;

			vec[j] = make_pair(x, ++idx);

		}

		a[i] = vec;

	}

	sort(lsh + 1, lsh + tot + 1);

	tot = unique(lsh + 1, lsh + tot + 1) - lsh - 1;

	for (int i = 1; i <= m; i++) {

		for (int j = 1; j <= n[i]; j++) {

			a[i][j].fi = lower_bound(lsh + 1, lsh + tot + 1, a[i][j].fi) - lsh;

			pos[a[i][j].fi].push_back(a[i][j].se);

		}

	}

	for (int i = 1; i <= m; i++) {

		for (int j = 1; j <= n[i]; j += 2) {

			add_edge(a[i][j].se, a[i][j + 1].se);

		}

	}

	for (int i = 1; i <= tot; i++) {

		if (pos[i].size() & 1) {

			cout << "NO\n";

			return 0;

		}

		for (int j = 0; j < pos[i].size(); j += 2) {

			add_edge(pos[i][j], pos[i][j + 1]);

		}

	}

	for (int i = 1; i <= idx; i++) {

		if (vis[i]) continue;

		dfs(i);

	}

	cout << "YES\n";

	for (int i = 1; i <= m; i++) {

		for (int j = 1; j <= n[i]; j++) {

			cout << (col[a[i][j].se] ? 'L' : 'R');

		}

		cout << '\n';

	}

	return 0;

}

```

