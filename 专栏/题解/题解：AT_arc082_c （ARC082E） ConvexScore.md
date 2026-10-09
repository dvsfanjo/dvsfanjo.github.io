## 思路



妙妙几何计数题，题意大概是一个凸包中不在凸包上的点数 $k$ 则凸包的权值为 $2^k$，求所有凸包的权值总和。



看到 $2^k$ 很奇怪，考虑组合意义是凸包点集除去顶点的集合中的子集数。问题转化为求这些合法子集的数量，这种子集不算入贡献时当且仅当点集不能组成凸包，即共线的情况。



于是枚举直线并统计有多少点在线上，设有 $cnt$ 个点，则总子集数减去这些非法的子集数即 $2^{cnt}$。



统计要求不重不漏，给点排序即可；判断共线交叉相乘避免浮点误差，当然这里数据范围很小可以忽略。



## 代码



```cpp

#include <bits/stdc++.h>

#define int long long

#define fi first

#define se second

using namespace std;

const int maxn = 205, p = 998244353;

int n, ans, id[maxn], x[maxn], y[maxn], pw[maxn] = {1};

inline bool check(int i, int j, int k) {

	pair <int, int> vec1 = make_pair(x[i] - x[j], y[i] - y[j]), 

					vec2 = make_pair(x[j] - x[k], y[j] - y[k]);

	return vec1.se * vec2.fi == vec2.se * vec1.fi;

}

signed main() {

	ios::sync_with_stdio(0);

	cin.tie(0); cout.tie(0);

	cin >> n;

	for (int i = 1; i <= n; i++) {

		cin >> x[i] >> y[i];

		pw[i] = (pw[i - 1] << 1) % p;

	}

	iota(id + 1, id + n + 1, 1);

	sort(id + 1, id + n + 1, [&](int i, int j) {

		if (x[i] ^ x[j]) return x[i] < x[j];

		return y[i] < y[j];

	});

	ans = pw[n];

	for (int i = 1; i <= n; i++) {

		for (int j = i + 1; j <= n; j++) {

			int cnt = 0;

			for (int k = i + 1; k < j; k++) {

				cnt += check(id[i], id[j], id[k]);

			}

			(ans += p - pw[cnt]) %= p;

		}

	}

	(ans += p - n - 1) %= p;

	cout << ans << '\n';

	return 0;

} 

```

