## Barrett 约减



除、模运算常数极大，因此需要少使用，在模 $p$ 意义下两个整数相加后值域在 $[0,2p-2]$ 内，此时检查若大于等于 $p$ 只要减去 $p$ 即可，这是普通的约减，但是遇到两个整数相乘就不再适用，因为两个整数相乘取模后比模数 $p$ 大很多，因此有了 Barrett 约简。



要求 $r=x\mod p$ 则相当于求 $r=x-p\lfloor\frac xp\rfloor$ 。每次运算都要对一个新数进行一次 “除以 $p$ ” 的操作，这是大常数的来源，但是 $\frac xp=\frac x{a}\times\frac{a}p$ ，这样只需要预处理 $\frac ap$ 的值，每次计算 $\frac xa$ 即可，当 $a$ 较大时下取整操作几乎是正确的，而选取 $a=2^{64}$ 可以用 ```>>``` 左移运算来代替除法。





:::info[封装]

```cpp

namespace mod_int {

	int p, m;

    inline void build(int _p) {

        p = _p, m = (((__int128)1 << 64) / p);

    }

	inline int barrett(int x) {

		int ans = x - ((__int128)x * m >> 64) * p;

		if (ans >= p) ans -= p;

		if (ans < 0) ans += p;

		return ans;

	}

	inline int inv(int a, int b = p - 2) {

		int res = 1;

		while (b) {

			if (b & 1) res = res * a % p;

			a = a * a % p, b >>= 1;

		}

		return res;

	}

	struct modint {

		int data;

		modint(int _data = 0) { data = barrett(_data); }

		friend modint operator + (const modint &a, const modint &b) { return modint(barrett(a.data + b.data)); }

		friend modint operator - (const modint &a, const modint &b) { return modint(barrett(a.data - b.data)); }

		friend modint operator * (const modint &a, const modint &b) { return modint(barrett(a.data * b.data)); }

		friend modint operator / (const modint &a, const modint &b) { return modint(barrett(a.data * inv(b.data))); }

		void operator += (const modint &b) { data = barrett(data + b.data); }

		void operator -= (const modint &b) { data = barrett(data - b.data); }

		void operator *= (const modint &b) { data = barrett(data * b.data); }

		void operator /= (const modint &b) { data = barrett(data * inv(b.data)); }

		friend ostream &operator << (ostream &output, const modint &a) { output << a.data; return output; }

		friend istream &operator >> (istream &input, modint &a) { input >> a.data; return input; }

	};

};

using mod_int::modint;

using mod_int::build;

```

:::



然而还是不要太神话 Barrett 的效果，因为在 O2 优化下取模运算本身就会被编译器进行类似的乘、左移等操作，当然要是完全没用也不至于不然就不会有这个算法了，貌似在特定情况的大数据下 Barrett 约减编译出来会比 ```%``` 快。



## 题



晚点再写。

