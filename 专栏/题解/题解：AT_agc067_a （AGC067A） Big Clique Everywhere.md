## 思路



神了，第一步想不到就没办法了。首先考虑建补图，即原图中两点间没有边，则补图中两点连边，这时原图中每个点集的完全图点集变成了独立集。



注意到，若补图中有奇环，则奇环上一定不存在符合的独立集，所以说合法时当且仅当补图中没有奇环，即补图是二分图。



最后的问题就是补图可能过大，事实上一个大小为 $n$ 的二分图，最多边数为 $O(\frac{n^2}{4})$ 级别的，当且仅当两边点数相差最小时达到最大，所以说当 $n$ 过大时补图一定不是二分图，无解。



## 代码



```cpp

#include<bits/stdc++.h>

#define int long long

using namespace std;

const int maxn = 3005;

int T, n, m, G[maxn][maxn], col[maxn], vis[maxn];

void dfs(int u, int fa) {

	if (vis[u]) return;

	vis[u] = true, col[u] = col[fa] ^ 1;

	for (int i = 1; i <= n; i++) {

		if (i == u) continue;

		if (G[u][i]) dfs(i, u);

	}

}

void solve() {

	cin >> n >> m;

	if (n > 3000) return cout << "NO\n", void();

	for (int i = 1; i <= n; i++) {

		for (int j = 1; j <= n; j++) {

			G[i][j] = 1;

		}

		col[i] = vis[i] = 0;

	}

	for (int i = 1, u, v; i <= m; i++) {

		cin >> u >> v;

		G[u][v] = G[v][u] = 0;

	}

	for (int i = 1; i <= n; i++) {

		if (vis[i]) continue;

		dfs(i, 0);

	}

	for (int i = 1; i <= n; i++) {

		for (int j = 1; j <= n; j++) {

			if (i == j) continue;

			if (G[i][j] && col[i] == col[j]) {

				return cout << "NO\n", void();

			}

		}

	}

	return cout << "YES\n", void();

}

signed main() {

    ios::sync_with_stdio(0);

    cin.tie(0); cout.tie(0);

    cin >> T; while (T--) solve();

    return 0;

}

```

