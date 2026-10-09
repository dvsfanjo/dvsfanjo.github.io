## 处理



首先发现一坨 $\max(x_i+x_j,y_i+y_j,z_i+z_j)$ 很难处理，于是想到让每一个蛋糕自主选择哪个值参与配对，那么选了哪些蛋糕就不重要了，重要的变为目前三种值存在的奇偶性，若是奇数，则当前蛋糕可以配对，最后在动态规划过程中求得的最大值即为所求，于是自然而然地列出状态：用 $f_{i,j,mask}$ 表示前 $i$ 个蛋糕中选了 $j$ 个蛋糕，目前三种状态的奇偶性为 $mask$，其中 $mask$ 是一个三位二进制数。



## 转移



显然可以分情况，当前不选，当前选用 $x$ 或 $y$ 或 $z$ 值配对，即：



```cpp

f[i][j][mask] = max(f[i - 1][j - 1][mask], f[i - 1][j - 1][mask ^ 1] + x[i], f[i - 1][j - 1][mask ^ 2] + y[i], f[i - 1][j - 1][mask ^ 4] + z[i])

```



答案为 $f_{n,2k,0}$。



时间复杂度 $O(nk)$ 不能通过。



## 优化



设选 $i$ 个蛋糕最后的最大值为 $F(i)$ 并可以发现以下特征：



1. 题目中要求在 $n$ 个蛋糕中选 $2k$ 个。

2. 如果没有 $2k$ 个的限制会很容易求，只需要把 DP 的第二维去掉即可。

3. 函数 $F(i)$ 有凸性，显然的，设 $F(x_0)$ 是最大值，则 $|i-x_0|$ 越大，答案 $F(i)$ 只会更劣。



综上，这道题完全符合使用 wqs 二分的性质！



二分斜率即可，但是斜率可能出现 $0.5$ 所以有乘除 $2$ 的处理，同时我们还要计算当前斜率下的蛋糕数，只需在成功转移时记录即可。



## 代码



```cpp

#include <bits/stdc++.h>

#define int long long

using namespace std;

const int maxn = 1e6 + 5;

int T, n, k, val[maxn][3], f[maxn][8], cnt[maxn][8];

void DP(int h) {

	for (int i = 0; i < 8; i++) {

		f[0][i] = -0x3f3f3f3f3f3f3f3f;

		cnt[0][i] = 0;

	}

	f[0][0] = 0;

	for (int i = 1; i <= n; i++) {

		for (int mask = 0; mask < 8; mask++) {

			f[i][mask] = f[i - 1][mask];

			cnt[i][mask] = cnt[i - 1][mask];

			for (int x = 0; x < 3; x++) {

				int tmp1 = f[i - 1][mask ^ (1 << x)] + (val[i][x] << 1) - h, 

					tmp2 = cnt[i - 1][mask ^ (1 << x)] + 1;

				if (tmp1 > f[i][mask] || (f[i][mask] == tmp1 && tmp2 > cnt[i][mask])) {

					f[i][mask] = tmp1;

					cnt[i][mask] = tmp2;

				}

			}

		}

	}

	return;

}

void solve() {

	cin >> n >> k;

	for (int i = 1; i <= n; i++) {

		for (int x = 0; x < 3; x++) {

			cin >> val[i][x];

		}

	}

	int l = 0, r = 1e18;

	while (l <= r) {

		int mid = l + r >> 1;

		DP(mid);

		if (cnt[n][0] >= (k << 1)) l = mid + 1;

		else r = mid - 1;

	}

	DP(r);

	cout << f[n][0] / 2 + k * r << '\n';

	return;

}

signed main() {

	ios::sync_with_stdio(0);

	cin.tie(0); cout.tie(0);

	cin >> T;

	while (T--) solve();

    return 0;

}

```



[通过记录](https://atcoder.jp/contests/abc400/submissions/77667098)

