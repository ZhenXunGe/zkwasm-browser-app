build:
	wasm-pack build --release --out-name gameplay.wasm --out-dir pkg
	wasm-opt -Oz -o ../src/js/game.wasm pkg/gameplay.wasm

trace:
	wasm-interp pkg/output.wasm --run-all-exports  --trace > trace.log
	wc -l trace.log

clean:
	rm -rf pkg
	rm -rf ../src/js/game.wasm
