build:
	wasm-pack build --release --out-name gameplay.wasm --out-dir pkg
	wasm-opt -Oz -o ../src/js/game.wasm pkg/gameplay.wasm
	cp pkg/gameplay.wasm.d.ts ../src/js/gameplay.wasm.d.ts

trace:
	wasm-interp pkg/output.wasm --run-all-exports  --trace > trace.log
	wc -l trace.log

clean:
	rm -rf pkg
	rm -rf ../src/js/game.wasm
