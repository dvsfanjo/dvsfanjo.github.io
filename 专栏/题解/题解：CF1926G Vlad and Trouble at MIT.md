## 思路



很经典的树形 DP 啊，每个结点要么定下来是 `S` 或 `P`，或者两者皆是的状态，那么只需要用 $f_{u,0/1}$ 表示在 $u$ 的子树内，钦定结点 $u$ 为 `P` 或 `S` 的状态时的最小次数，当且仅当与子节点状态不同时的连边产生贡献。当然，要是结点 $u$ 定下来了，那么另一种不可能的钦定则非法，最小次数设为 $\infty$ 即可。



## 代码



```cpp

#include <bits/stdc++.h>

#define int long long

#define fi first

#define se second

using namespace std;

const int maxn = 2e5 + 5, inf = 1e18;

int T, n, f[maxn][2];

char op[maxn];

vector <int> G[maxn];

void dfs(int u) {

	f[u][0] = f[u][1] = 0;

	for (int v : G[u]) {

		dfs(v);

		f[u][0] += min(f[v][0], f[v][1] + 1);

		f[u][1] += min(f[v][1], f[v][0] + 1);

	}

	if (op[u] == 'P') f[u][1] = inf;

	else if (op[u] == 'S') f[u][0] = inf;

}

void solve() {

	cin >> n;

	for (int i = 1; i <= n; i++) G[i].clear();

	for (int i = 2, fa; i <= n; i++) {

		cin >> fa;

		G[fa].push_back(i);

	}

	for (int i = 1; i <= n; i++) cin >> op[i];

	dfs(1);

	cout << min(f[1][0], f[1][1]) << '\n';

	return;

}

signed main() {

	ios::sync_with_stdio(0);

	cin.tie(0), cout.tie(0);

	cin >> T; while (T--) solve();

	return 0;

}

```

